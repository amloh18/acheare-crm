import { PayrollLifecycleService, PayrollPeriodStatus } from 'src/modules/hr/services/payroll-lifecycle.service';
import { type WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { type WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { type PayrollCalculationService } from 'src/modules/hr/services/payroll-calculation.service';

const WORKSPACE_ID = 'ec9b0b2a-4c02-4d1e-9f2a-9b1c0a5d7e31';
const PERIOD_ID = '6a7b8c9d-0e1f-2a3b-4c5d-6e7f80123456';
const EMPLOYEE_ID = '1d6d3a4e-6b0f-4f7a-9a4b-1a2b3c4d5e6f';

const createInMemoryRepository = <T extends Record<string, unknown>>(rows: T[]) => {
  const store = [...rows];

  return {
    find: jest.fn(
      async ({
        where = {},
      }: {
        where?: Record<string, unknown>;
      } = {}) =>
        store.filter((row) =>
          Object.entries(where).every(
            ([key, value]) => (row as Record<string, unknown>)[key] === value,
          ),
        ),
    ),
    findOne: jest.fn(
      async ({
        where = {},
      }: {
        where?: Record<string, unknown>;
      } = {}) =>
        store.find((row) =>
          Object.entries(where).every(
            ([key, value]) => (row as Record<string, unknown>)[key] === value,
          ),
        ) ?? null,
    ),
    save: jest.fn(async (row: Record<string, unknown>) => {
      const existing = store.findIndex(
        (s) => (s as Record<string, unknown>).id === row.id,
      );
      if (existing >= 0) {
        store[existing] = { ...store[existing], ...row } as T;
        return store[existing];
      }
      const saved = { id: PERIOD_ID, createdAt: new Date().toISOString(), ...row } as T;
      store.push(saved);
      return saved;
    }),
  };
};

type HarnessOverrides = {
  periods?: Record<string, unknown>[];
  payslips?: Record<string, unknown>[];
  calculationServiceOverrides?: Partial<PayrollCalculationService>;
};

const buildHarness = ({
  periods = [],
  payslips = [],
  calculationServiceOverrides = {},
}: HarnessOverrides = {}) => {
  const repositories: Record<string, ReturnType<typeof createInMemoryRepository>> = {
    payrollPeriod: createInMemoryRepository(periods),
    payslip: createInMemoryRepository(payslips),
  };

  const workspaceOrmManager = {
    executeInWorkspaceContext: jest.fn(
      async (callback: () => Promise<unknown>) => callback(),
    ),
    getRepository: jest.fn((objectName: string) => repositories[objectName]),
  };

  const workspaceEventEmitter = {
    emitCustomBatchEvent: jest.fn(),
  };

  const payrollCalculationService = {
    validatePayrollPreflight: jest.fn(async () => ({ ready: [], issues: [] })),
    calculatePayslip: jest.fn(async () => ({
      grossEarnings: 0,
      totalDeductions: 0,
      totalAdjustments: 0,
      netPay: 0,
      lines: [],
    })),
    savePayslip: jest.fn(async () => ({})),
    ...calculationServiceOverrides,
  };

  const service = new PayrollLifecycleService(
    workspaceOrmManager as unknown as WorkspaceOrmManager,
    workspaceEventEmitter as unknown as WorkspaceEventEmitter,
    payrollCalculationService as unknown as PayrollCalculationService,
  );

  return { service, repositories, workspaceEventEmitter, payrollCalculationService };
};

describe('PayrollLifecycleService', () => {
  describe('createPayrollPeriod', () => {
    it('creates a period with DRAFT status and zero totals', async () => {
      const { service, repositories } = buildHarness();

      const result = await service.createPayrollPeriod(
        'March 2026',
        new Date('2026-03-01'),
        new Date('2026-03-31'),
        new Date('2026-04-05'),
        WORKSPACE_ID,
      );

      expect(result.status).toBe(PayrollPeriodStatus.DRAFT);
      expect(result.employeeCount).toBe(0);
      expect(result.totalGross).toBe(0);
      expect(result.totalDeductions).toBe(0);
      expect(result.totalNet).toBe(0);
      expect(repositories.payrollPeriod.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'March 2026',
          status: PayrollPeriodStatus.DRAFT,
        }),
      );
    });
  });

  describe('transitionPeriodStatus', () => {
    it('allows DRAFT -> CALCULATED', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.DRAFT }],
      });

      const result = await service.transitionPeriodStatus(
        PERIOD_ID,
        PayrollPeriodStatus.CALCULATED,
        WORKSPACE_ID,
      );

      expect(result.status).toBe(PayrollPeriodStatus.CALCULATED);
    });

    it('allows CALCULATED -> UNDER_REVIEW', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.CALCULATED }],
      });

      const result = await service.transitionPeriodStatus(
        PERIOD_ID,
        PayrollPeriodStatus.UNDER_REVIEW,
        WORKSPACE_ID,
      );

      expect(result.status).toBe(PayrollPeriodStatus.UNDER_REVIEW);
    });

    it('allows UNDER_REVIEW -> APPROVED', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.UNDER_REVIEW }],
      });

      const result = await service.transitionPeriodStatus(
        PERIOD_ID,
        PayrollPeriodStatus.APPROVED,
        WORKSPACE_ID,
      );

      expect(result.status).toBe(PayrollPeriodStatus.APPROVED);
    });

    it('allows UNDER_REVIEW -> CALCULATED (send back for recalculation)', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.UNDER_REVIEW }],
      });

      const result = await service.transitionPeriodStatus(
        PERIOD_ID,
        PayrollPeriodStatus.CALCULATED,
        WORKSPACE_ID,
      );

      expect(result.status).toBe(PayrollPeriodStatus.CALCULATED);
    });

    it('allows APPROVED -> PAID', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.APPROVED }],
      });

      const result = await service.transitionPeriodStatus(
        PERIOD_ID,
        PayrollPeriodStatus.PAID,
        WORKSPACE_ID,
      );

      expect(result.status).toBe(PayrollPeriodStatus.PAID);
    });

    it('allows PAID -> LOCKED', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.PAID }],
      });

      const result = await service.transitionPeriodStatus(
        PERIOD_ID,
        PayrollPeriodStatus.LOCKED,
        WORKSPACE_ID,
      );

      expect(result.status).toBe(PayrollPeriodStatus.LOCKED);
    });

    it('rejects LOCKED -> any status (terminal state)', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.LOCKED }],
      });

      await expect(
        service.transitionPeriodStatus(PERIOD_ID, PayrollPeriodStatus.DRAFT, WORKSPACE_ID),
      ).rejects.toThrow('Invalid status transition');
    });

    it('rejects DRAFT -> APPROVED (skipping required steps)', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.DRAFT }],
      });

      await expect(
        service.transitionPeriodStatus(PERIOD_ID, PayrollPeriodStatus.APPROVED, WORKSPACE_ID),
      ).rejects.toThrow('Invalid status transition');
    });

    it('rejects PAID -> CALCULATED (cannot go backwards)', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.PAID }],
      });

      await expect(
        service.transitionPeriodStatus(PERIOD_ID, PayrollPeriodStatus.CALCULATED, WORKSPACE_ID),
      ).rejects.toThrow('Invalid status transition');
    });

    it('throws when period not found', async () => {
      const { service } = buildHarness({ periods: [] });

      await expect(
        service.transitionPeriodStatus('nonexistent', PayrollPeriodStatus.CALCULATED, WORKSPACE_ID),
      ).rejects.toThrow('Payroll period nonexistent not found');
    });

    it('emits payroll_periodStatusChanged event', async () => {
      const { service, workspaceEventEmitter } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.DRAFT }],
      });

      await service.transitionPeriodStatus(
        PERIOD_ID,
        PayrollPeriodStatus.CALCULATED,
        WORKSPACE_ID,
      );

      expect(workspaceEventEmitter.emitCustomBatchEvent).toHaveBeenCalledWith(
        'payroll_periodStatusChanged',
        expect.arrayContaining([
          expect.objectContaining({
            periodId: PERIOD_ID,
            fromStatus: PayrollPeriodStatus.DRAFT,
            toStatus: PayrollPeriodStatus.CALCULATED,
            workspaceId: WORKSPACE_ID,
          }),
        ]),
        WORKSPACE_ID,
      );
    });
  });

  describe('calculatePayroll', () => {
    it('throws when period is not in DRAFT status', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.CALCULATED }],
      });

      await expect(
        service.calculatePayroll(PERIOD_ID, [EMPLOYEE_ID], WORKSPACE_ID),
      ).rejects.toThrow('Payroll period must be in DRAFT status to calculate');
    });

    it('throws when period not found', async () => {
      const { service } = buildHarness({ periods: [] });

      await expect(
        service.calculatePayroll('nonexistent', [EMPLOYEE_ID], WORKSPACE_ID),
      ).rejects.toThrow('Payroll period nonexistent not found');
    });

    it('calls preflight validation then calculates payslips for ready employees', async () => {
      const { service, payrollCalculationService } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.DRAFT, startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31') }],
      });

      (payrollCalculationService.validatePayrollPreflight as jest.Mock).mockResolvedValue({
        ready: [EMPLOYEE_ID],
        issues: [],
      });

      const result = await service.calculatePayroll(PERIOD_ID, [EMPLOYEE_ID], WORKSPACE_ID);

      expect(payrollCalculationService.validatePayrollPreflight).toHaveBeenCalledWith(
        [EMPLOYEE_ID],
        expect.any(Date),
        expect.any(Date),
        WORKSPACE_ID,
      );
      expect(payrollCalculationService.calculatePayslip).toHaveBeenCalledWith(
        expect.objectContaining({ employeeId: EMPLOYEE_ID }),
        WORKSPACE_ID,
      );
      expect(payrollCalculationService.savePayslip).toHaveBeenCalled();
      expect(result.payslipsCreated).toBe(1);
      expect(result.errors).toEqual([]);
    });

    it('collects errors for employees with preflight issues', async () => {
      const { service, payrollCalculationService } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.DRAFT, startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31') }],
      });

      (payrollCalculationService.validatePayrollPreflight as jest.Mock).mockResolvedValue({
        ready: [],
        issues: [
          { employeeId: EMPLOYEE_ID, issue: 'Employee not found', severity: 'ERROR' },
        ],
      });

      const result = await service.calculatePayroll(PERIOD_ID, [EMPLOYEE_ID], WORKSPACE_ID);

      expect(result.payslipsCreated).toBe(0);
      expect(result.errors).toEqual([
        expect.objectContaining({
          employeeId: EMPLOYEE_ID,
          error: 'Employee not found',
        }),
      ]);
    });

    it('collects errors when calculatePayslip throws', async () => {
      const { service, payrollCalculationService } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.DRAFT, startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31') }],
      });

      (payrollCalculationService.validatePayrollPreflight as jest.Mock).mockResolvedValue({
        ready: [EMPLOYEE_ID],
        issues: [],
      });
      (payrollCalculationService.calculatePayslip as jest.Mock).mockRejectedValue(
        new Error('No salary structure'),
      );

      const result = await service.calculatePayroll(PERIOD_ID, [EMPLOYEE_ID], WORKSPACE_ID);

      expect(result.payslipsCreated).toBe(0);
      expect(result.errors).toEqual([
        expect.objectContaining({
          employeeId: EMPLOYEE_ID,
          error: 'No salary structure',
        }),
      ]);
    });

    it('transitions period to CALCULATED after successful calculation', async () => {
      const { service, repositories, payrollCalculationService } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.DRAFT, startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31') }],
      });

      (payrollCalculationService.validatePayrollPreflight as jest.Mock).mockResolvedValue({
        ready: [EMPLOYEE_ID],
        issues: [],
      });

      await service.calculatePayroll(PERIOD_ID, [EMPLOYEE_ID], WORKSPACE_ID);

      expect(repositories.payrollPeriod.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: PayrollPeriodStatus.CALCULATED,
          employeeCount: 1,
        }),
      );
    });
  });

  describe('approvePayroll', () => {
    it('transitions UNDER_REVIEW -> APPROVED and emits event', async () => {
      const { service, workspaceEventEmitter } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.UNDER_REVIEW }],
      });

      const result = await service.approvePayroll(PERIOD_ID, 'approver-1', WORKSPACE_ID);

      expect(result.status).toBe(PayrollPeriodStatus.APPROVED);
      expect(workspaceEventEmitter.emitCustomBatchEvent).toHaveBeenCalledWith(
        'payroll_approved',
        expect.arrayContaining([
          expect.objectContaining({
            periodId: PERIOD_ID,
            approverId: 'approver-1',
          }),
        ]),
        WORKSPACE_ID,
      );
    });

    it('throws when period is not in UNDER_REVIEW status', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.DRAFT }],
      });

      await expect(
        service.approvePayroll(PERIOD_ID, 'approver-1', WORKSPACE_ID),
      ).rejects.toThrow('Invalid status transition');
    });
  });

  describe('lockPayroll', () => {
    it('transitions PAID -> LOCKED and emits event', async () => {
      const { service, workspaceEventEmitter } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.PAID }],
      });

      const result = await service.lockPayroll(PERIOD_ID, WORKSPACE_ID);

      expect(result.status).toBe(PayrollPeriodStatus.LOCKED);
      expect(workspaceEventEmitter.emitCustomBatchEvent).toHaveBeenCalledWith(
        'payroll_locked',
        expect.arrayContaining([expect.objectContaining({ periodId: PERIOD_ID })]),
        WORKSPACE_ID,
      );
    });

    it('throws when period is not in PAID status', async () => {
      const { service } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.APPROVED }],
      });

      await expect(
        service.lockPayroll(PERIOD_ID, WORKSPACE_ID),
      ).rejects.toThrow('Invalid status transition');
    });
  });

  describe('markPayslipPaid', () => {
    it('sets payslip to PAID with payment details', async () => {
      const payslip = {
        id: 'payslip-1',
        payrollPeriodId: PERIOD_ID,
        employeeId: EMPLOYEE_ID,
        paymentStatus: 'UNPAID',
      };

      const { service, repositories } = buildHarness({ payslips: [payslip] });

      const result = await service.markPayslipPaid(
        'payslip-1',
        'BANK_TRANSFER',
        'TXN-123',
        WORKSPACE_ID,
      );

      expect(result.paymentStatus).toBe('PAID');
      expect(result.paymentMethod).toBe('BANK_TRANSFER');
      expect(result.paymentReference).toBe('TXN-123');
      expect(result.paidAt).toBeDefined();
      expect(repositories.payslip.save).toHaveBeenCalled();
    });

    it('throws when payslip not found', async () => {
      const { service } = buildHarness({ payslips: [] });

      await expect(
        service.markPayslipPaid('nonexistent', 'BANK_TRANSFER', 'TXN-123', WORKSPACE_ID),
      ).rejects.toThrow('Payslip nonexistent not found');
    });
  });

  describe('markAllPayslipsPaid', () => {
    it('marks all unpaid payslips as paid and transitions to PAID', async () => {
      const payslips = [
        { id: 'p-1', payrollPeriodId: PERIOD_ID, paymentStatus: 'UNPAID' },
        { id: 'p-2', payrollPeriodId: PERIOD_ID, paymentStatus: 'UNPAID' },
        { id: 'p-3', payrollPeriodId: PERIOD_ID, paymentStatus: 'PAID' },
      ];

      const { service, repositories } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.APPROVED }],
        payslips,
      });

      const count = await service.markAllPayslipsPaid(
        PERIOD_ID,
        'BANK_TRANSFER',
        WORKSPACE_ID,
      );

      expect(count).toBe(2);
      expect(repositories.payslip.save).toHaveBeenCalledTimes(2);
      expect(repositories.payrollPeriod.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: PayrollPeriodStatus.PAID }),
      );
    });

    it('returns 0 when no unpaid payslips exist', async () => {
      const payslips = [
        { id: 'p-1', payrollPeriodId: PERIOD_ID, paymentStatus: 'PAID' },
      ];

      const { service, repositories } = buildHarness({
        periods: [{ id: PERIOD_ID, status: PayrollPeriodStatus.APPROVED }],
        payslips,
      });

      const count = await service.markAllPayslipsPaid(
        PERIOD_ID,
        'BANK_TRANSFER',
        WORKSPACE_ID,
      );

      expect(count).toBe(0);
    });
  });

  describe('getPayslipsForPeriod', () => {
    it('returns payslips matching the period id', async () => {
      const payslips = [
        { id: 'p-1', payrollPeriodId: PERIOD_ID },
        { id: 'p-2', payrollPeriodId: PERIOD_ID },
        { id: 'p-3', payrollPeriodId: 'other-period' },
      ];

      const { service, repositories } = buildHarness({ payslips });

      const result = await service.getPayslipsForPeriod(PERIOD_ID, WORKSPACE_ID);

      expect(result).toHaveLength(2);
      expect(result.every((p) => p.payrollPeriodId === PERIOD_ID)).toBe(true);
    });
  });

  describe('getEmployeePayslips', () => {
    it('returns payslips matching the employee id', async () => {
      const payslips = [
        { id: 'p-1', employeeId: EMPLOYEE_ID },
        { id: 'p-2', employeeId: EMPLOYEE_ID },
        { id: 'p-3', employeeId: 'other-employee' },
      ];

      const { service, repositories } = buildHarness({ payslips });

      const result = await service.getEmployeePayslips(EMPLOYEE_ID, WORKSPACE_ID);

      expect(result).toHaveLength(2);
      expect(result.every((p) => p.employeeId === EMPLOYEE_ID)).toBe(true);
    });
  });
});
