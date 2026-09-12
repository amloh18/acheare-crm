import { type WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { PayrollCalculationService } from 'src/modules/hr/services/payroll-calculation.service';

const WORKSPACE_ID = 'ec9b0b2a-4c02-4d1e-9f2a-9b1c0a5d7e31';
const EMPLOYEE_ID = '1d6d3a4e-6b0f-4f7a-9a4b-1a2b3c4d5e6f';
const STRUCTURE_ID = '2c7e8f90-1111-4222-8333-444455556666';

const PERIOD_START = new Date('2026-01-01T00:00:00.000Z');
const PERIOD_END = new Date('2026-01-31T23:59:59.000Z');

const createInMemoryRepository = (rows: Record<string, unknown>[]) => ({
  find: jest.fn(
    async ({
      where = {},
      order,
    }: {
      where?: Record<string, unknown>;
      order?: Record<string, 'ASC' | 'DESC'>;
    } = {}) => {
      let result = rows.filter((row) =>
        Object.entries(where).every(
          ([key, value]) => (row as Record<string, unknown>)[key] === value,
        ),
      );

      if (order) {
        const [orderKey, direction] = Object.entries(order)[0];

        result = [...result].sort((a, b) => {
          const left = (a as Record<string, unknown>)[orderKey] as string;
          const right = (b as Record<string, unknown>)[orderKey] as string;

          return direction === 'DESC'
            ? new Date(right).getTime() - new Date(left).getTime()
            : new Date(left).getTime() - new Date(right).getTime();
        });
      }

      return result;
    },
  ),
  findOne: jest.fn(
    async ({
      where = {},
    }: {
      where?: Record<string, unknown>;
    } = {}) =>
      rows.find((row) =>
        Object.entries(where).every(
          ([key, value]) => (row as Record<string, unknown>)[key] === value,
        ),
      ) ?? null,
  ),
  save: jest.fn(async (row: Record<string, unknown>) => ({
    id: 'saved-id',
    ...row,
  })),
});

type HarnessOverrides = {
  employees?: Record<string, unknown>[];
  structures?: Record<string, unknown>[];
  components?: Record<string, unknown>[];
  attendanceDays?: Record<string, unknown>[];
  leaveRequests?: Record<string, unknown>[];
  leaveTypes?: Record<string, unknown>[];
  adjustments?: Record<string, unknown>[];
};

const buildHarness = ({
  employees = [
    {
      id: EMPLOYEE_ID,
      status: 'ACTIVE',
      joiningDate: new Date('2020-01-01T00:00:00.000Z'),
      exitDate: null,
    },
  ],
  structures = [
    {
      id: STRUCTURE_ID,
      employeeId: EMPLOYEE_ID,
      monthlyGross: 100_000,
      effectiveFrom: new Date('2020-01-01T00:00:00.000Z'),
      effectiveTo: null,
      isActive: true,
    },
  ],
  components = [],
  attendanceDays = [],
  leaveRequests = [],
  leaveTypes = [],
  adjustments = [],
}: HarnessOverrides = {}) => {
  const repositories: Record<string, ReturnType<typeof createInMemoryRepository>> =
    {
      employee: createInMemoryRepository(employees),
      salaryStructure: createInMemoryRepository(structures),
      salaryComponent: createInMemoryRepository(components),
      attendanceDay: createInMemoryRepository(attendanceDays),
      leaveRequest: createInMemoryRepository(leaveRequests),
      leaveType: createInMemoryRepository(leaveTypes),
      payrollAdjustment: createInMemoryRepository(adjustments),
    };

  const workspaceOrmManager = {
    executeInWorkspaceContext: jest.fn(
      async (callback: () => Promise<unknown>) => callback(),
    ),
    getRepository: jest.fn((objectName: string) => repositories[objectName]),
  };

  return new PayrollCalculationService(
    workspaceOrmManager as unknown as WorkspaceOrmManager,
  );
};

const buildInput = (overrides: Partial<Parameters<PayrollCalculationService['calculatePayslip']>[0]> = {}) => ({
  employeeId: EMPLOYEE_ID,
  periodStartDate: PERIOD_START,
  periodEndDate: PERIOD_END,
  currency: 'INR',
  workingDaysInMonth: 31,
  ...overrides,
});

describe('PayrollCalculationService', () => {
  describe('calculatePayslip', () => {
    it('sums fixed and percentage earnings, deductions and adjustments into net pay', async () => {
      const service = buildHarness({
        components: [
          {
            id: 'comp-1',
            salaryStructureId: STRUCTURE_ID,
            name: 'Basic',
            componentType: 'EARNING',
            calculationType: 'FIXED',
            amount: 60_000,
          },
          {
            id: 'comp-2',
            salaryStructureId: STRUCTURE_ID,
            name: 'HRA',
            componentType: 'EARNING',
            calculationType: 'PERCENTAGE',
            percentage: 40,
          },
          {
            id: 'comp-3',
            salaryStructureId: STRUCTURE_ID,
            name: 'Professional Tax',
            componentType: 'DEDUCTION',
            calculationType: 'FIXED',
            amount: 5_000,
          },
        ],
        attendanceDays: [
          {
            id: 'att-1',
            employeeId: EMPLOYEE_ID,
            workDate: new Date('2026-01-05T00:00:00.000Z'),
            status: 'PRESENT',
            overtimeMinutes: 30,
          },
          {
            id: 'att-2',
            employeeId: EMPLOYEE_ID,
            workDate: new Date('2026-01-06T00:00:00.000Z'),
            status: 'LATE',
            overtimeMinutes: 30,
          },
        ],
        adjustments: [
          {
            id: 'adj-1',
            employeeId: EMPLOYEE_ID,
            status: 'APPROVED',
            amount: 2_500,
            reason: 'Performance bonus',
            createdAt: new Date('2026-01-10T00:00:00.000Z'),
          },
        ],
      });

      const result = await service.calculatePayslip(buildInput(), WORKSPACE_ID);

      // 60_000 fixed + 40% of 100_000 monthly gross
      expect(result.grossEarnings).toBe(100_000);
      expect(result.totalDeductions).toBe(5_000);
      expect(result.totalAdjustments).toBe(2_500);
      expect(result.netPay).toBe(97_500);
      expect(result.prorationFactor).toBe(1);
      expect(result.presentDays).toBe(2);
      expect(result.overtimeMinutes).toBe(60);
      expect(result.lines.map((line) => line.lineType)).toEqual([
        'EARNING',
        'EARNING',
        'DEDUCTION',
        'ADJUSTMENT',
      ]);
    });

    it('deducts unpaid leave per day of the monthly gross', async () => {
      const service = buildHarness({
        structures: [
          {
            id: STRUCTURE_ID,
            employeeId: EMPLOYEE_ID,
            monthlyGross: 31_000,
            effectiveFrom: new Date('2020-01-01T00:00:00.000Z'),
            effectiveTo: null,
          },
        ],
        leaveRequests: [
          {
            id: 'leave-1',
            employeeId: EMPLOYEE_ID,
            status: 'APPROVED',
            startDate: new Date('2026-01-05T00:00:00.000Z'),
            endDate: new Date('2026-01-07T00:00:00.000Z'),
            leaveTypeId: 'lt-unpaid',
          },
        ],
        leaveTypes: [{ id: 'lt-unpaid', isPaid: false }],
      });

      const result = await service.calculatePayslip(buildInput(), WORKSPACE_ID);

      expect(result.unpaidLeaveDays).toBe(3);
      expect(result.paidLeaveDays).toBe(0);
      expect(result.totalDeductions).toBe(3_000);
      expect(result.lines.map((line) => line.label)).toContain(
        'Unpaid Leave (3 days)',
      );
    });

    it('counts paid leave without deducting it', async () => {
      const service = buildHarness({
        leaveRequests: [
          {
            id: 'leave-1',
            employeeId: EMPLOYEE_ID,
            status: 'APPROVED',
            startDate: new Date('2026-01-05T00:00:00.000Z'),
            endDate: new Date('2026-01-07T00:00:00.000Z'),
            leaveTypeId: 'lt-paid',
          },
        ],
        leaveTypes: [{ id: 'lt-paid', isPaid: true }],
      });

      const result = await service.calculatePayslip(buildInput(), WORKSPACE_ID);

      expect(result.paidLeaveDays).toBe(3);
      expect(result.unpaidLeaveDays).toBe(0);
      expect(result.totalDeductions).toBe(0);
    });

    it('prorates earnings for a mid-month joiner', async () => {
      const service = buildHarness({
        employees: [
          {
            id: EMPLOYEE_ID,
            status: 'ACTIVE',
            joiningDate: new Date('2026-01-16T00:00:00.000Z'),
            exitDate: null,
          },
        ],
        structures: [
          {
            id: STRUCTURE_ID,
            employeeId: EMPLOYEE_ID,
            monthlyGross: 31_000,
            effectiveFrom: new Date('2020-01-01T00:00:00.000Z'),
            effectiveTo: null,
          },
        ],
        components: [
          {
            id: 'comp-1',
            salaryStructureId: STRUCTURE_ID,
            name: 'Basic',
            componentType: 'EARNING',
            calculationType: 'FIXED',
            amount: 31_000,
          },
        ],
      });

      const result = await service.calculatePayslip(buildInput(), WORKSPACE_ID);

      // 16 working days out of 31 in the month
      expect(result.prorationFactor).toBeCloseTo(16 / 31, 6);
      expect(result.grossEarnings).toBe(16_000);
      expect(result.netPay).toBe(16_000);
    });

    it('only counts adjustments dated inside the period', async () => {
      const service = buildHarness({
        structures: [
          {
            id: STRUCTURE_ID,
            employeeId: EMPLOYEE_ID,
            monthlyGross: 10_000,
            effectiveFrom: new Date('2020-01-01T00:00:00.000Z'),
            effectiveTo: null,
          },
        ],
        components: [
          {
            id: 'comp-1',
            salaryStructureId: STRUCTURE_ID,
            name: 'Basic',
            componentType: 'EARNING',
            calculationType: 'FIXED',
            amount: 10_000,
          },
        ],
        adjustments: [
          {
            id: 'adj-in-period',
            employeeId: EMPLOYEE_ID,
            status: 'APPROVED',
            amount: 500,
            createdAt: new Date('2026-01-10T00:00:00.000Z'),
          },
          {
            id: 'adj-out-of-period',
            employeeId: EMPLOYEE_ID,
            status: 'APPROVED',
            amount: 9_999,
            createdAt: new Date('2025-12-20T00:00:00.000Z'),
          },
        ],
      });

      const result = await service.calculatePayslip(buildInput(), WORKSPACE_ID);

      expect(result.totalAdjustments).toBe(500);
      expect(result.netPay).toBe(10_500);
    });

    it('throws when the employee does not exist', async () => {
      const service = buildHarness({ employees: [] });

      await expect(
        service.calculatePayslip(buildInput(), WORKSPACE_ID),
      ).rejects.toThrow(/not found/);
    });

    it('throws when the employee is not active', async () => {
      const service = buildHarness({
        employees: [
          {
            id: EMPLOYEE_ID,
            status: 'TERMINATED',
            joiningDate: new Date('2020-01-01T00:00:00.000Z'),
            exitDate: new Date('2025-12-31T00:00:00.000Z'),
          },
        ],
      });

      await expect(
        service.calculatePayslip(buildInput(), WORKSPACE_ID),
      ).rejects.toThrow(/not active/);
    });

    it('throws when no salary structure is effective at the period start', async () => {
      const service = buildHarness({ structures: [] });

      await expect(
        service.calculatePayslip(buildInput(), WORKSPACE_ID),
      ).rejects.toThrow(/No salary structure found/);
    });
  });

  describe('validatePayrollPreflight', () => {
    it('reports missing employees, inactive employees and missing structures', async () => {
      const service = buildHarness({
        employees: [
          {
            id: EMPLOYEE_ID,
            status: 'TERMINATED',
            joiningDate: new Date('2020-01-01T00:00:00.000Z'),
            exitDate: null,
          },
        ],
        structures: [],
      });

      const result = await service.validatePayrollPreflight(
        [EMPLOYEE_ID, 'unknown-employee'],
        PERIOD_START,
        PERIOD_END,
        WORKSPACE_ID,
      );

      expect(result.ready).toEqual([]);
      expect(result.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            employeeId: EMPLOYEE_ID,
            issue: 'Employee is TERMINATED, not ACTIVE',
            severity: 'WARNING',
          }),
          expect.objectContaining({
            employeeId: EMPLOYEE_ID,
            issue: 'No active salary structure',
            severity: 'ERROR',
          }),
          expect.objectContaining({
            employeeId: 'unknown-employee',
            issue: 'Employee not found',
            severity: 'ERROR',
          }),
        ]),
      );
    });
  });
});
