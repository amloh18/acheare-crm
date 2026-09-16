import { LeaveService, LeaveRequestStatus } from 'src/modules/hr/services/leave.service';
import { type WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { type WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';

const WORKSPACE_ID = 'ec9b0b2a-4c02-4d1e-9f2a-9b1c0a5d7e31';
const EMPLOYEE_ID = '1d6d3a4e-6b0f-4f7a-9a4b-1a2b3c4d5e6f';
const LEAVE_TYPE_ID = '4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8012';
const LEAVE_REQUEST_ID = '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f801234';

const CURRENT_YEAR = new Date().getFullYear();

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
      const saved = { id: LEAVE_REQUEST_ID, createdAt: new Date().toISOString(), ...row } as T;
      store.push(saved);
      return saved;
    }),
  };
};

type HarnessOverrides = {
  leaveRequests?: Record<string, unknown>[];
  leaveBalances?: Record<string, unknown>[];
  leaveTypes?: Record<string, unknown>[];
  attendanceDays?: Record<string, unknown>[];
};

const buildHarness = ({
  leaveRequests = [],
  leaveBalances = [],
  leaveTypes = [{ id: LEAVE_TYPE_ID, annualQuota: 20, name: 'Annual Leave' }],
  attendanceDays = [],
}: HarnessOverrides = {}) => {
  const repositories: Record<string, ReturnType<typeof createInMemoryRepository>> = {
    leaveRequest: createInMemoryRepository(leaveRequests),
    leaveBalance: createInMemoryRepository(leaveBalances),
    leaveType: createInMemoryRepository(leaveTypes),
    attendanceDay: createInMemoryRepository(attendanceDays),
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

  const service = new LeaveService(
    workspaceOrmManager as unknown as WorkspaceOrmManager,
    workspaceEventEmitter as unknown as WorkspaceEventEmitter,
  );

  return { service, repositories, workspaceEventEmitter };
};

describe('LeaveService', () => {
  describe('requestLeave', () => {
    it('creates a leave request and updates balance pending days', async () => {
      const { service, repositories, workspaceEventEmitter } = buildHarness();

      const startDate = new Date('2026-04-01');
      const endDate = new Date('2026-04-03'); // Wed-Fri, 3 business days

      const result = await service.requestLeave(
        EMPLOYEE_ID,
        LEAVE_TYPE_ID,
        startDate,
        endDate,
        'Family vacation',
        WORKSPACE_ID,
      );

      expect(result.status).toBe(LeaveRequestStatus.PENDING);
      expect(result.days).toBe(3);
      expect(repositories.leaveRequest.save).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: EMPLOYEE_ID,
          leaveTypeId: LEAVE_TYPE_ID,
          startDate,
          endDate,
          days: 3,
          reason: 'Family vacation',
          status: LeaveRequestStatus.PENDING,
        }),
      );
      expect(workspaceEventEmitter.emitCustomBatchEvent).not.toHaveBeenCalled();
    });

    it('creates a balance record when none exists for the leave type', async () => {
      const { service, repositories } = buildHarness({ leaveBalances: [] });

      await service.requestLeave(
        EMPLOYEE_ID,
        LEAVE_TYPE_ID,
        new Date('2026-04-01'),
        new Date('2026-04-01'),
        'Day off',
        WORKSPACE_ID,
      );

      expect(repositories.leaveBalance.save).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: EMPLOYEE_ID,
          leaveTypeId: LEAVE_TYPE_ID,
          year: CURRENT_YEAR,
          entitled: 20,
          used: 0,
          pending: 1,
        }),
      );
    });

    it('increments pending days on existing balance', async () => {
      const existingBalance = {
        id: 'bal-1',
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        year: CURRENT_YEAR,
        entitled: 20,
        used: 5,
        pending: 2,
      };

      const { service, repositories } = buildHarness({
        leaveBalances: [existingBalance],
      });

      await service.requestLeave(
        EMPLOYEE_ID,
        LEAVE_TYPE_ID,
        new Date('2026-04-01'),
        new Date('2026-04-02'),
        'Medical',
        WORKSPACE_ID,
      );

      expect(repositories.leaveBalance.save).toHaveBeenCalledWith(
        expect.objectContaining({
          pending: 4, // 2 existing + 2 new business days
        }),
      );
    });

    it('throws when leave type not found', async () => {
      const { service } = buildHarness({ leaveTypes: [] });

      await expect(
        service.requestLeave(
          EMPLOYEE_ID,
          'nonexistent',
          new Date('2026-04-01'),
          new Date('2026-04-01'),
          'Day off',
          WORKSPACE_ID,
        ),
      ).rejects.toThrow('Leave type nonexistent not found');
    });

    it('throws when insufficient leave balance', async () => {
      const existingBalance = {
        id: 'bal-1',
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        year: CURRENT_YEAR,
        entitled: 10,
        used: 8,
        pending: 1,
      };

      const { service } = buildHarness({ leaveBalances: [existingBalance] });

      await expect(
        service.requestLeave(
          EMPLOYEE_ID,
          LEAVE_TYPE_ID,
          new Date('2026-04-01'),
          new Date('2026-04-05'),
          'Long trip',
          WORKSPACE_ID,
        ),
      ).rejects.toThrow('Insufficient leave balance');
    });

    it('excludes weekends from day count', async () => {
      const { service, repositories } = buildHarness();

      // Mon Apr 6 to Fri Apr 10, 2026 = 5 business days
      await service.requestLeave(
        EMPLOYEE_ID,
        LEAVE_TYPE_ID,
        new Date('2026-04-06'),
        new Date('2026-04-10'),
        'Full week',
        WORKSPACE_ID,
      );

      expect(repositories.leaveRequest.save).toHaveBeenCalledWith(
        expect.objectContaining({ days: 5 }),
      );
    });

    it('counts Saturday and Sunday as zero days when range is only weekends', async () => {
      const { service, repositories } = buildHarness();

      // Sat-Sun
      await service.requestLeave(
        EMPLOYEE_ID,
        LEAVE_TYPE_ID,
        new Date('2026-04-04'),
        new Date('2026-04-05'),
        'Weekend only',
        WORKSPACE_ID,
      );

      expect(repositories.leaveRequest.save).toHaveBeenCalledWith(
        expect.objectContaining({ days: 0 }),
      );
    });
  });

  describe('approveLeave', () => {
    it('approves a pending leave request and updates balance', async () => {
      const pendingRequest = {
        id: LEAVE_REQUEST_ID,
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        status: LeaveRequestStatus.PENDING,
        days: 3,
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-04-03'),
      };

      const existingBalance = {
        id: 'bal-1',
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        year: CURRENT_YEAR,
        entitled: 20,
        used: 5,
        pending: 3,
      };

      const { service, repositories, workspaceEventEmitter } = buildHarness({
        leaveRequests: [pendingRequest],
        leaveBalances: [existingBalance],
      });

      const result = await service.approveLeave(
        LEAVE_REQUEST_ID,
        'reviewer-1',
        'Approved',
        WORKSPACE_ID,
      );

      expect(result.status).toBe(LeaveRequestStatus.APPROVED);
      expect(result.reviewedById).toBe('reviewer-1');
      expect(repositories.leaveBalance.save).toHaveBeenCalledWith(
        expect.objectContaining({
          pending: 0, // 3 - 3 = 0
          used: 8, // 5 + 3
        }),
      );
      expect(workspaceEventEmitter.emitCustomBatchEvent).toHaveBeenCalledWith(
        'leave_approved',
        expect.arrayContaining([
          expect.objectContaining({
            leaveRequestId: LEAVE_REQUEST_ID,
            employeeId: EMPLOYEE_ID,
            reviewerId: 'reviewer-1',
          }),
        ]),
        WORKSPACE_ID,
      );
    });

    it('marks attendance days as LEAVE for each day in the range', async () => {
      const pendingRequest = {
        id: LEAVE_REQUEST_ID,
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        status: LeaveRequestStatus.PENDING,
        days: 2,
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-04-02'),
      };

      const { service, repositories } = buildHarness({
        leaveRequests: [pendingRequest],
      });

      await service.approveLeave(LEAVE_REQUEST_ID, 'reviewer-1', '', WORKSPACE_ID);

      expect(repositories.attendanceDay.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'LEAVE' }),
      );
    });

    it('throws when leave request not found', async () => {
      const { service } = buildHarness();

      await expect(
        service.approveLeave('nonexistent', 'reviewer-1', '', WORKSPACE_ID),
      ).rejects.toThrow('Leave request nonexistent not found');
    });

    it('throws when leave request is not pending', async () => {
      const { service } = buildHarness({
        leaveRequests: [
          { id: LEAVE_REQUEST_ID, status: LeaveRequestStatus.APPROVED },
        ],
      });

      await expect(
        service.approveLeave(LEAVE_REQUEST_ID, 'reviewer-1', '', WORKSPACE_ID),
      ).rejects.toThrow('Leave request already APPROVED');
    });
  });

  describe('rejectLeave', () => {
    it('rejects a pending leave request and decrements pending balance', async () => {
      const pendingRequest = {
        id: LEAVE_REQUEST_ID,
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        status: LeaveRequestStatus.PENDING,
        days: 2,
      };

      const existingBalance = {
        id: 'bal-1',
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        year: CURRENT_YEAR,
        entitled: 20,
        used: 5,
        pending: 2,
      };

      const { service, repositories, workspaceEventEmitter } = buildHarness({
        leaveRequests: [pendingRequest],
        leaveBalances: [existingBalance],
      });

      const result = await service.rejectLeave(
        LEAVE_REQUEST_ID,
        'reviewer-1',
        'Not enough coverage',
        WORKSPACE_ID,
      );

      expect(result.status).toBe(LeaveRequestStatus.REJECTED);
      expect(repositories.leaveBalance.save).toHaveBeenCalledWith(
        expect.objectContaining({
          pending: 0, // 2 - 2 = 0
        }),
      );
      expect(workspaceEventEmitter.emitCustomBatchEvent).toHaveBeenCalledWith(
        'leave_rejected',
        expect.arrayContaining([
          expect.objectContaining({
            leaveRequestId: LEAVE_REQUEST_ID,
            reviewerId: 'reviewer-1',
          }),
        ]),
        WORKSPACE_ID,
      );
    });

    it('does not modify used days on rejection', async () => {
      const pendingRequest = {
        id: LEAVE_REQUEST_ID,
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        status: LeaveRequestStatus.PENDING,
        days: 3,
      };

      const existingBalance = {
        id: 'bal-1',
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        year: CURRENT_YEAR,
        entitled: 20,
        used: 10,
        pending: 3,
      };

      const { service, repositories } = buildHarness({
        leaveRequests: [pendingRequest],
        leaveBalances: [existingBalance],
      });

      await service.rejectLeave(LEAVE_REQUEST_ID, 'reviewer-1', '', WORKSPACE_ID);

      expect(repositories.leaveBalance.save).toHaveBeenCalledWith(
        expect.objectContaining({ used: 10 }),
      );
    });

    it('throws when leave request not found', async () => {
      const { service } = buildHarness();

      await expect(
        service.rejectLeave('nonexistent', 'reviewer-1', '', WORKSPACE_ID),
      ).rejects.toThrow('Leave request nonexistent not found');
    });

    it('throws when leave request is not pending', async () => {
      const { service } = buildHarness({
        leaveRequests: [
          { id: LEAVE_REQUEST_ID, status: LeaveRequestStatus.REJECTED },
        ],
      });

      await expect(
        service.rejectLeave(LEAVE_REQUEST_ID, 'reviewer-1', '', WORKSPACE_ID),
      ).rejects.toThrow('Leave request already REJECTED');
    });
  });

  describe('cancelLeave', () => {
    it('cancels a pending leave request and decrements pending balance', async () => {
      const pendingRequest = {
        id: LEAVE_REQUEST_ID,
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        status: LeaveRequestStatus.PENDING,
        days: 2,
      };

      const existingBalance = {
        id: 'bal-1',
        employeeId: EMPLOYEE_ID,
        leaveTypeId: LEAVE_TYPE_ID,
        year: CURRENT_YEAR,
        entitled: 20,
        used: 5,
        pending: 2,
      };

      const { service, repositories } = buildHarness({
        leaveRequests: [pendingRequest],
        leaveBalances: [existingBalance],
      });

      const result = await service.cancelLeave(
        LEAVE_REQUEST_ID,
        EMPLOYEE_ID,
        WORKSPACE_ID,
      );

      expect(result.status).toBe(LeaveRequestStatus.CANCELLED);
      expect(repositories.leaveBalance.save).toHaveBeenCalledWith(
        expect.objectContaining({ pending: 0 }),
      );
    });

    it('throws when leave request not found', async () => {
      const { service } = buildHarness();

      await expect(
        service.cancelLeave('nonexistent', EMPLOYEE_ID, WORKSPACE_ID),
      ).rejects.toThrow('Leave request nonexistent not found');
    });

    it('throws when leave request is not pending', async () => {
      const { service } = buildHarness({
        leaveRequests: [
          { id: LEAVE_REQUEST_ID, employeeId: EMPLOYEE_ID, status: LeaveRequestStatus.APPROVED },
        ],
      });

      await expect(
        service.cancelLeave(LEAVE_REQUEST_ID, EMPLOYEE_ID, WORKSPACE_ID),
      ).rejects.toThrow('Only pending leave requests can be cancelled');
    });
  });

  describe('getLeaveBalance', () => {
    it('returns balances for the employee and year', async () => {
      const balances = [
        { id: 'bal-1', employeeId: EMPLOYEE_ID, year: CURRENT_YEAR, leaveTypeId: LEAVE_TYPE_ID, entitled: 20, used: 5, pending: 2 },
      ];

      const { service, repositories } = buildHarness({ leaveBalances: balances });
      repositories.leaveBalance.find.mockResolvedValue(balances);

      const result = await service.getLeaveBalance(EMPLOYEE_ID, CURRENT_YEAR, WORKSPACE_ID);

      expect(result).toEqual(balances);
    });
  });

  describe('getAvailableLeaveDays', () => {
    it('returns entitled minus used minus pending', async () => {
      const { service, repositories } = buildHarness({
        leaveBalances: [
          { id: 'bal-1', employeeId: EMPLOYEE_ID, leaveTypeId: LEAVE_TYPE_ID, year: CURRENT_YEAR, entitled: 20, used: 5, pending: 3 },
        ],
      });

      const result = await service.getAvailableLeaveDays(EMPLOYEE_ID, LEAVE_TYPE_ID, WORKSPACE_ID);

      expect(result).toBe(12);
    });

    it('returns 0 when no balance record exists', async () => {
      const { service } = buildHarness({ leaveBalances: [] });

      const result = await service.getAvailableLeaveDays(EMPLOYEE_ID, LEAVE_TYPE_ID, WORKSPACE_ID);

      expect(result).toBe(0);
    });

    it('returns 0 when fully consumed', async () => {
      const { service } = buildHarness({
        leaveBalances: [
          { id: 'bal-1', employeeId: EMPLOYEE_ID, leaveTypeId: LEAVE_TYPE_ID, year: CURRENT_YEAR, entitled: 10, used: 7, pending: 3 },
        ],
      });

      const result = await service.getAvailableLeaveDays(EMPLOYEE_ID, LEAVE_TYPE_ID, WORKSPACE_ID);

      expect(result).toBe(0);
    });
  });
});
