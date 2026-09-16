import { AttendanceService, AttendanceEventType, AttendanceStatus, RemoteCheckInApprovalStatus } from 'src/modules/hr/services/attendance.service';
import { type WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { type WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { type LocationService } from 'src/modules/hr/services/location.service';

const WORKSPACE_ID = 'ec9b0b2a-4c02-4d1e-9f2a-9b1c0a5d7e31';
const EMPLOYEE_ID = '1d6d3a4e-6b0f-4f7a-9a4b-1a2b3c4d5e6f';
const EVENT_ID = '3a4b5c6d-7e8f-9012-3456-7890abcdef12';

const valuesEqual = (a: unknown, b: unknown): boolean => {
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  return a === b;
};

const createInMemoryRepository = <T extends Record<string, unknown>>(rows: T[]) => {
  const store = [...rows];

  return {
    find: jest.fn(
      async ({
        where = {},
        order,
      }: {
        where?: Record<string, unknown>;
        order?: Record<string, 'ASC' | 'DESC'>;
      } = {}) => {
        let result = store.filter((row) =>
          Object.entries(where).every(
            ([key, value]) => valuesEqual((row as Record<string, unknown>)[key], value),
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
        store.find((row) =>
          Object.entries(where).every(
            ([key, value]) => valuesEqual((row as Record<string, unknown>)[key], value),
          ),
        ) ?? null,
    ),
    save: jest.fn(async (row: Record<string, unknown>) => {
      const existing = store.findIndex(
        (s) => (s as Record<string, unknown>).id === row.id,
      );
      if (existing >= 0) {
        store[existing] = { ...store[existing], ...row } as T;
      } else {
        const saved = { id: EVENT_ID, createdAt: new Date().toISOString(), ...row } as T;
        store.push(saved);
        return saved;
      }
      return store[existing] as T;
    }),
  };
};

type HarnessOverrides = {
  events?: Record<string, unknown>[];
  days?: Record<string, unknown>[];
  corrections?: Record<string, unknown>[];
  shifts?: Record<string, unknown>[];
  rosterAssignments?: Record<string, unknown>[];
  companySettings?: Record<string, unknown>[];
  nearestLocation?: { location: { name: string }; distanceMeters: number } | null;
};

const buildHarness = ({
  events = [],
  days = [],
  corrections = [],
  shifts = [],
  rosterAssignments = [],
  companySettings = [
    { id: 'settings-1', isActive: true, requireGeolocationForCheckIn: false, allowRemoteCheckIn: true },
  ],
  nearestLocation = null,
}: HarnessOverrides = {}) => {
  const repositories: Record<string, ReturnType<typeof createInMemoryRepository>> = {
    attendanceEvent: createInMemoryRepository(events),
    attendanceDay: createInMemoryRepository(days),
    attendanceCorrection: createInMemoryRepository(corrections),
    shift: createInMemoryRepository(shifts),
    rosterAssignment: createInMemoryRepository(rosterAssignments),
    companySettings: createInMemoryRepository(companySettings),
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

  const locationService = {
    findNearestLocation: jest.fn(async () => nearestLocation),
  };

  const service = new AttendanceService(
    workspaceOrmManager as unknown as WorkspaceOrmManager,
    workspaceEventEmitter as unknown as WorkspaceEventEmitter,
    locationService as unknown as LocationService,
  );

  return { service, repositories, workspaceEventEmitter, locationService };
};

describe('AttendanceService', () => {
  describe('checkIn', () => {
    it('creates a CHECK_IN event and a new attendance day', async () => {
      const { service, repositories, workspaceEventEmitter } = buildHarness();
      const checkInTime = new Date('2026-03-10T09:00:00.000Z');

      const event = await service.checkIn(EMPLOYEE_ID, WORKSPACE_ID, checkInTime);

      expect(repositories.attendanceEvent.save).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: EMPLOYEE_ID,
          eventType: AttendanceEventType.CHECK_IN,
          timestamp: checkInTime,
          source: 'SELF_SERVICE',
        }),
      );
      expect(repositories.attendanceDay.save).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: EMPLOYEE_ID,
          firstCheckIn: checkInTime,
          status: AttendanceStatus.PRESENT,
        }),
      );
      expect(workspaceEventEmitter.emitCustomBatchEvent).toHaveBeenCalledWith(
        'attendance_checkedIn',
        expect.arrayContaining([
          expect.objectContaining({ employeeId: EMPLOYEE_ID }),
        ]),
        WORKSPACE_ID,
      );
    });

    it('throws when employee already checked in today', async () => {
      const existingEvent = {
        id: 'existing',
        employeeId: EMPLOYEE_ID,
        eventType: AttendanceEventType.CHECK_IN,
        timestamp: new Date('2026-03-10T08:55:00.000Z'),
        createdAt: new Date('2026-03-10T08:55:00.000Z'),
      };

      const { service } = buildHarness({ events: [existingEvent] });
      const sameDay = new Date('2026-03-10T09:10:00.000Z');

      await expect(
        service.checkIn(EMPLOYEE_ID, WORKSPACE_ID, sameDay),
      ).rejects.toThrow('Already checked in today');
    });

    it('allows check-in on a different day after prior check-in', async () => {
      const existingEvent = {
        id: 'existing',
        employeeId: EMPLOYEE_ID,
        eventType: AttendanceEventType.CHECK_IN,
        timestamp: new Date('2026-03-09T09:00:00.000Z'),
        createdAt: new Date('2026-03-09T09:00:00.000Z'),
      };

      const { service, repositories } = buildHarness({ events: [existingEvent] });
      const nextDay = new Date('2026-03-10T09:00:00.000Z');

      await service.checkIn(EMPLOYEE_ID, WORKSPACE_ID, nextDay);

      expect(repositories.attendanceEvent.save).toHaveBeenCalled();
    });

    it('marks remote check-in with PENDING approval when geolocation required and no nearby location', async () => {
      const { service, repositories } = buildHarness({
        companySettings: [
          { id: 'settings-1', isActive: true, requireGeolocationForCheckIn: true, allowRemoteCheckIn: true },
        ],
        nearestLocation: null,
      });

      await service.checkIn(EMPLOYEE_ID, WORKSPACE_ID, new Date('2026-03-10T09:00:00.000Z'), 28.6139, 77.2090);

      expect(repositories.attendanceEvent.save).toHaveBeenCalledWith(
        expect.objectContaining({
          isRemote: true,
          approvalStatus: RemoteCheckInApprovalStatus.PENDING,
          locationName: 'Remote',
        }),
      );
    });

    it('sets non-remote when geolocation matches a nearby location', async () => {
      const { service, repositories } = buildHarness({
        companySettings: [
          { id: 'settings-1', isActive: true, requireGeolocationForCheckIn: true, allowRemoteCheckIn: true },
        ],
        nearestLocation: { location: { name: 'Office Mumbai' }, distanceMeters: 50 },
      });

      await service.checkIn(EMPLOYEE_ID, WORKSPACE_ID, new Date('2026-03-10T09:00:00.000Z'), 28.6139, 77.2090);

      expect(repositories.attendanceEvent.save).toHaveBeenCalledWith(
        expect.objectContaining({
          isRemote: false,
          approvalStatus: null,
          locationName: 'Office Mumbai',
        }),
      );
    });

    it('throws when remote check-in is not allowed', async () => {
      const { service } = buildHarness({
        companySettings: [
          { id: 'settings-1', isActive: true, requireGeolocationForCheckIn: true, allowRemoteCheckIn: false },
        ],
        nearestLocation: null,
      });

      await expect(
        service.checkIn(EMPLOYEE_ID, WORKSPACE_ID, new Date('2026-03-10T09:00:00.000Z'), 28.6139, 77.2090),
      ).rejects.toThrow('Remote clock-in is not allowed');
    });

    it('throws when geolocation required but not provided', async () => {
      const { service } = buildHarness({
        companySettings: [
          { id: 'settings-1', isActive: true, requireGeolocationForCheckIn: true, allowRemoteCheckIn: true },
        ],
      });

      await expect(
        service.checkIn(EMPLOYEE_ID, WORKSPACE_ID, new Date('2026-03-10T09:00:00.000Z')),
      ).rejects.toThrow('Geolocation is required for clock-in');
    });

    it('creates attendance day with WORK_FROM_HOME status for pending remote check-in', async () => {
      const { service, repositories } = buildHarness({
        companySettings: [
          { id: 'settings-1', isActive: true, requireGeolocationForCheckIn: true, allowRemoteCheckIn: true },
        ],
        nearestLocation: null,
      });

      await service.checkIn(EMPLOYEE_ID, WORKSPACE_ID, new Date('2026-03-10T09:00:00.000Z'), 28.6139, 77.2090);

      expect(repositories.attendanceDay.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: AttendanceStatus.WORK_FROM_HOME,
          hasRemoteCheckIn: true,
        }),
      );
    });

    it('updates existing attendance day instead of creating a new one', async () => {
      const existingDay = {
        id: 'day-1',
        employeeId: EMPLOYEE_ID,
        workDate: new Date('2026-03-10T00:00:00.000Z'),
        firstCheckIn: null as Date | null,
        hasRemoteCheckIn: false,
      };

      const { service, repositories } = buildHarness({ days: [existingDay] });

      await service.checkIn(EMPLOYEE_ID, WORKSPACE_ID, new Date('2026-03-10T09:00:00.000Z'));

      expect(repositories.attendanceDay.save).toHaveBeenCalledWith(
        expect.objectContaining({
          firstCheckIn: expect.any(Date),
        }),
      );
    });
  });

  describe('checkOut', () => {
    it('creates a CHECK_OUT event and calculates worked minutes', async () => {
      const existingDay = {
        id: 'day-1',
        employeeId: EMPLOYEE_ID,
        workDate: new Date('2026-03-10T00:00:00.000Z'),
        firstCheckIn: new Date('2026-03-10T09:00:00.000Z'),
        lastCheckOut: null as Date | null,
        workedMinutes: null as number | null,
      };

      const { service, repositories, workspaceEventEmitter } = buildHarness();
      repositories.attendanceDay.findOne.mockResolvedValue(existingDay);

      const checkOutTime = new Date('2026-03-10T18:00:00.000Z');
      await service.checkOut(EMPLOYEE_ID, WORKSPACE_ID, checkOutTime);

      expect(repositories.attendanceEvent.save).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: EMPLOYEE_ID,
          eventType: AttendanceEventType.CHECK_OUT,
          timestamp: checkOutTime,
        }),
      );
      expect(repositories.attendanceDay.save).toHaveBeenCalledWith(
        expect.objectContaining({
          lastCheckOut: checkOutTime,
          workedMinutes: 540, // 9 hours in minutes
        }),
      );
      expect(workspaceEventEmitter.emitCustomBatchEvent).toHaveBeenCalledWith(
        'attendance_checkedOut',
        expect.arrayContaining([expect.objectContaining({ employeeId: EMPLOYEE_ID })]),
        WORKSPACE_ID,
      );
    });

    it('sets workedMinutes to 0 when no firstCheckIn exists', async () => {
      const existingDay = {
        id: 'day-1',
        employeeId: EMPLOYEE_ID,
        workDate: new Date('2026-03-10T00:00:00.000Z'),
        firstCheckIn: null as Date | null,
        lastCheckOut: null as Date | null,
      };

      const { service, repositories } = buildHarness();
      repositories.attendanceDay.findOne.mockResolvedValue(existingDay);

      await service.checkOut(EMPLOYEE_ID, WORKSPACE_ID, new Date('2026-03-10T18:00:00.000Z'));

      expect(repositories.attendanceDay.save).toHaveBeenCalledWith(
        expect.objectContaining({ workedMinutes: 0 }),
      );
    });

    it('still creates check-out event even when no attendance day exists', async () => {
      const { service, repositories } = buildHarness({ days: [] });

      const event = await service.checkOut(
        EMPLOYEE_ID,
        WORKSPACE_ID,
        new Date('2026-03-10T18:00:00.000Z'),
      );

      expect(repositories.attendanceEvent.save).toHaveBeenCalled();
      expect(event).toBeDefined();
    });

    it('resolves location name when geolocation provided', async () => {
      const { service, repositories, locationService } = buildHarness({
        nearestLocation: { location: { name: 'Office Delhi' }, distanceMeters: 20 },
      });

      await service.checkOut(
        EMPLOYEE_ID,
        WORKSPACE_ID,
        new Date('2026-03-10T18:00:00.000Z'),
        28.6139,
        77.2090,
      );

      expect(locationService.findNearestLocation).toHaveBeenCalledWith(28.6139, 77.2090, WORKSPACE_ID);
      expect(repositories.attendanceEvent.save).toHaveBeenCalledWith(
        expect.objectContaining({ locationName: 'Office Delhi' }),
      );
    });

    it('sets location to Remote when no nearby location found', async () => {
      const { service, repositories } = buildHarness({ nearestLocation: null });

      await service.checkOut(
        EMPLOYEE_ID,
        WORKSPACE_ID,
        new Date('2026-03-10T18:00:00.000Z'),
        28.6139,
        77.2090,
      );

      expect(repositories.attendanceEvent.save).toHaveBeenCalledWith(
        expect.objectContaining({ locationName: 'Remote' }),
      );
    });
  });

  describe('approveRemoteCheckIn', () => {
    it('sets approval status to APPROVED and updates day to PRESENT', async () => {
      const pendingEvent = {
        id: EVENT_ID,
        employeeId: EMPLOYEE_ID,
        eventType: AttendanceEventType.CHECK_IN,
        isRemote: true,
        approvalStatus: RemoteCheckInApprovalStatus.PENDING,
        timestamp: new Date('2026-03-10T09:00:00.000Z'),
      };

      const { service, repositories, workspaceEventEmitter } = buildHarness({
        events: [pendingEvent],
      });

      const result = await service.approveRemoteCheckIn(EVENT_ID, true, 'reviewer-1', WORKSPACE_ID);

      expect(result.approvalStatus).toBe(RemoteCheckInApprovalStatus.APPROVED);
      expect(repositories.attendanceDay.save).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: EMPLOYEE_ID,
          status: AttendanceStatus.PRESENT,
        }),
      );
      expect(workspaceEventEmitter.emitCustomBatchEvent).toHaveBeenCalledWith(
        'attendance_remoteCheckInReviewed',
        expect.arrayContaining([
          expect.objectContaining({ approved: true, reviewerId: 'reviewer-1' }),
        ]),
        WORKSPACE_ID,
      );
    });

    it('sets approval status to REJECTED and updates day to ABSENT', async () => {
      const pendingEvent = {
        id: EVENT_ID,
        employeeId: EMPLOYEE_ID,
        eventType: AttendanceEventType.CHECK_IN,
        isRemote: true,
        approvalStatus: RemoteCheckInApprovalStatus.PENDING,
        timestamp: new Date('2026-03-10T09:00:00.000Z'),
      };

      const { service, repositories } = buildHarness({ events: [pendingEvent] });

      const result = await service.approveRemoteCheckIn(EVENT_ID, false, 'reviewer-1', WORKSPACE_ID);

      expect(result.approvalStatus).toBe(RemoteCheckInApprovalStatus.REJECTED);
      expect(repositories.attendanceDay.save).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: EMPLOYEE_ID,
          status: AttendanceStatus.ABSENT,
        }),
      );
    });

    it('throws when event not found', async () => {
      const { service } = buildHarness({ events: [] });

      await expect(
        service.approveRemoteCheckIn('nonexistent', true, 'reviewer-1', WORKSPACE_ID),
      ).rejects.toThrow('Attendance event not found');
    });

    it('throws when event is not pending approval', async () => {
      const alreadyApprovedEvent = {
        id: EVENT_ID,
        employeeId: EMPLOYEE_ID,
        approvalStatus: RemoteCheckInApprovalStatus.APPROVED,
      };

      const { service } = buildHarness({ events: [alreadyApprovedEvent] });

      await expect(
        service.approveRemoteCheckIn(EVENT_ID, true, 'reviewer-1', WORKSPACE_ID),
      ).rejects.toThrow('This check-in is not pending approval');
    });
  });

  describe('getPendingRemoteCheckIns', () => {
    it('returns only pending remote check-in events', async () => {
      const events = [
        { id: '1', eventType: AttendanceEventType.CHECK_IN, isRemote: true, approvalStatus: RemoteCheckInApprovalStatus.PENDING },
        { id: '2', eventType: AttendanceEventType.CHECK_IN, isRemote: true, approvalStatus: RemoteCheckInApprovalStatus.APPROVED },
        { id: '3', eventType: AttendanceEventType.CHECK_OUT, isRemote: false, approvalStatus: null },
      ];

      const { service } = buildHarness({ events });

      const result = await service.getPendingRemoteCheckIns(WORKSPACE_ID);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('requestCorrection', () => {
    it('creates a correction request with PENDING status', async () => {
      const { service, repositories } = buildHarness();

      const result = await service.requestCorrection(
        EMPLOYEE_ID,
        new Date('2026-03-10'),
        new Date('2026-03-10T09:00:00.000Z'),
        new Date('2026-03-10T17:00:00.000Z'),
        'Forgot to check in',
        WORKSPACE_ID,
      );

      expect(repositories.attendanceEvent.save).not.toHaveBeenCalled();
      expect(result.status).toBe('PENDING');
    });
  });

  describe('reviewCorrection', () => {
    it('approves a correction and updates attendance day', async () => {
      const pendingCorrection = {
        id: 'corr-1',
        employeeId: EMPLOYEE_ID,
        workDate: new Date('2026-03-10'),
        requestedCheckIn: new Date('2026-03-10T09:00:00.000Z'),
        requestedCheckOut: new Date('2026-03-10T17:00:00.000Z'),
        status: 'PENDING',
      };

      const { service, repositories, workspaceEventEmitter } = buildHarness({
        corrections: [pendingCorrection],
      });

      const result = await service.reviewCorrection(
        'corr-1',
        true,
        'reviewer-1',
        'Approved',
        WORKSPACE_ID,
      );

      expect(result.status).toBe('APPROVED');
      expect(repositories.attendanceDay.save).toHaveBeenCalledWith(
        expect.objectContaining({
          employeeId: EMPLOYEE_ID,
          status: AttendanceStatus.PRESENT,
          firstCheckIn: pendingCorrection.requestedCheckIn,
          lastCheckOut: pendingCorrection.requestedCheckOut,
        }),
      );
      expect(workspaceEventEmitter.emitCustomBatchEvent).toHaveBeenCalledWith(
        'attendance_correctionReviewed',
        expect.arrayContaining([
          expect.objectContaining({ approved: true }),
        ]),
        WORKSPACE_ID,
      );
    });

    it('rejects a correction without updating attendance day', async () => {
      const pendingCorrection = {
        id: 'corr-1',
        employeeId: EMPLOYEE_ID,
        status: 'PENDING',
      };

      const { service, repositories } = buildHarness({
        corrections: [pendingCorrection],
      });

      const result = await service.reviewCorrection(
        'corr-1',
        false,
        'reviewer-1',
        'Not valid',
        WORKSPACE_ID,
      );

      expect(result.status).toBe('REJECTED');
      expect(repositories.attendanceDay.save).not.toHaveBeenCalled();
    });

    it('throws when correction not found', async () => {
      const { service } = buildHarness({ corrections: [] });

      await expect(
        service.reviewCorrection('nonexistent', true, 'reviewer-1', 'notes', WORKSPACE_ID),
      ).rejects.toThrow('Correction nonexistent not found');
    });

    it('throws when correction already reviewed', async () => {
      const { service } = buildHarness({
        corrections: [{ id: 'corr-1', status: 'APPROVED' }],
      });

      await expect(
        service.reviewCorrection('corr-1', true, 'reviewer-1', 'notes', WORKSPACE_ID),
      ).rejects.toThrow('Correction already APPROVED');
    });
  });

  describe('aggregateDailyAttendance', () => {
    it('calculates worked minutes from first check-in to last check-out', async () => {
      const events = [
        { id: 'e1', employeeId: EMPLOYEE_ID, eventType: AttendanceEventType.CHECK_IN, timestamp: new Date('2026-03-10T09:00:00.000Z'), isRemote: false, createdAt: new Date('2026-03-10T09:00:00.000Z') },
        { id: 'e2', employeeId: EMPLOYEE_ID, eventType: AttendanceEventType.CHECK_OUT, timestamp: new Date('2026-03-10T18:00:00.000Z'), isRemote: false, createdAt: new Date('2026-03-10T18:00:00.000Z') },
      ];

      const { service, repositories } = buildHarness({ events });
      repositories.attendanceEvent.find.mockResolvedValue(events);
      repositories.attendanceDay.findOne.mockResolvedValue(null);

      const result = await service.aggregateDailyAttendance(
        EMPLOYEE_ID,
        new Date('2026-03-10'),
        WORKSPACE_ID,
      );

      expect(result.workedMinutes).toBe(540);
      expect(result.status).toBe(AttendanceStatus.PRESENT);
    });

    it('detects late arrival based on shift start time', async () => {
      const events = [
        { id: 'e1', employeeId: EMPLOYEE_ID, eventType: AttendanceEventType.CHECK_IN, timestamp: new Date('2026-03-10T09:20:00.000Z'), isRemote: false, createdAt: new Date('2026-03-10T09:20:00.000Z') },
      ];

      const { service, repositories } = buildHarness({
        events,
        shifts: [
          { id: 'shift-1', startTime: '09:00', graceMinutes: 15 },
        ],
        rosterAssignments: [
          { employeeId: EMPLOYEE_ID, shiftId: 'shift-1', isActive: true },
        ],
      });
      repositories.attendanceEvent.find.mockResolvedValue(events);
      repositories.attendanceDay.findOne.mockResolvedValue(null);

      const result = await service.aggregateDailyAttendance(
        EMPLOYEE_ID,
        new Date('2026-03-10'),
        WORKSPACE_ID,
      );

      expect(result.status).toBe(AttendanceStatus.LATE);
    });

    it('marks ABSENT when no check-in events exist', async () => {
      const { service, repositories } = buildHarness({ events: [] });
      repositories.attendanceEvent.find.mockResolvedValue([]);
      repositories.attendanceDay.findOne.mockResolvedValue(null);

      const result = await service.aggregateDailyAttendance(
        EMPLOYEE_ID,
        new Date('2026-03-10'),
        WORKSPACE_ID,
      );

      expect(result.status).toBe(AttendanceStatus.ABSENT);
      expect(result.workedMinutes).toBe(0);
    });

    it('marks WORK_FROM_HOME when pending remote check-in exists', async () => {
      const events = [
        { id: 'e1', employeeId: EMPLOYEE_ID, eventType: AttendanceEventType.CHECK_IN, timestamp: new Date('2026-03-10T09:00:00.000Z'), isRemote: true, approvalStatus: RemoteCheckInApprovalStatus.PENDING, createdAt: new Date('2026-03-10T09:00:00.000Z') },
      ];

      const { service, repositories } = buildHarness({ events });
      repositories.attendanceEvent.find.mockResolvedValue(events);
      repositories.attendanceDay.findOne.mockResolvedValue(null);

      const result = await service.aggregateDailyAttendance(
        EMPLOYEE_ID,
        new Date('2026-03-10'),
        WORKSPACE_ID,
      );

      expect(result.status).toBe(AttendanceStatus.WORK_FROM_HOME);
      expect(result.hasRemoteCheckIn).toBe(true);
    });
  });

  describe('getAttendanceSummary', () => {
    it('counts present, absent, late and calculates totals', async () => {
      const days = [
        { employeeId: EMPLOYEE_ID, workDate: new Date('2026-03-10'), status: 'PRESENT', workedMinutes: 480, overtimeMinutes: 0 },
        { employeeId: EMPLOYEE_ID, workDate: new Date('2026-03-11'), status: 'LATE', workedMinutes: 470, overtimeMinutes: 10 },
        { employeeId: EMPLOYEE_ID, workDate: new Date('2026-03-12'), status: 'ABSENT', workedMinutes: 0, overtimeMinutes: 0 },
        { employeeId: EMPLOYEE_ID, workDate: new Date('2026-03-13'), status: 'PRESENT', workedMinutes: 500, overtimeMinutes: 20 },
      ];

      const { service, repositories } = buildHarness({ days });
      repositories.attendanceDay.find.mockResolvedValue(days);

      const result = await service.getAttendanceSummary(
        EMPLOYEE_ID,
        new Date('2026-03-01'),
        new Date('2026-03-31'),
        WORKSPACE_ID,
      );

      expect(result.present).toBe(2);
      expect(result.late).toBe(1);
      expect(result.absent).toBe(1);
      expect(result.totalWorkedMinutes).toBe(1450);
      expect(result.totalOvertimeMinutes).toBe(30);
    });
  });
});
