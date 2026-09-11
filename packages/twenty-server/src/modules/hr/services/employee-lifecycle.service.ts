import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  NOTICE_PERIOD = 'NOTICE_PERIOD',
  RELEASED = 'RELEASED',
  EXITED = 'EXITED',
  ON_HOLD = 'ON_HOLD',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERN = 'INTERN',
  PROBATION = 'PROBATION',
}

@Injectable()
export class EmployeeLifecycleService {
  private readonly logger = new Logger(EmployeeLifecycleService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
  ) {}

  async activateEmployee(
    employeeId: string,
    workspaceId: string,
  ): Promise<EmployeeWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
            { shouldBypassPermissionChecks: true },
          );

        const employee = await repository.findOne({
          where: { id: employeeId },
        });

        if (!employee) {
          throw new Error(`Employee ${employeeId} not found`);
        }

        const updated = (await repository.save({
          ...employee,
          status: EmployeeStatus.ACTIVE,
        } as Partial<EmployeeWorkspaceEntity>)) as unknown as EmployeeWorkspaceEntity;

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'employee_activated',
          [{ employeeId: updated.id, workspaceId }],
          workspaceId,
        );

        return updated;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async deactivateEmployee(
    employeeId: string,
    reason: string,
    workspaceId: string,
  ): Promise<EmployeeWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
            { shouldBypassPermissionChecks: true },
          );

        const employee = await repository.findOne({
          where: { id: employeeId },
        });

        if (!employee) {
          throw new Error(`Employee ${employeeId} not found`);
        }

        const updated = (await repository.save({
          ...employee,
          status: EmployeeStatus.RELEASED,
          exitDate: new Date(),
        } as Partial<EmployeeWorkspaceEntity>)) as unknown as EmployeeWorkspaceEntity;

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'employee_deactivated',
          [{ employeeId: updated.id, reason, workspaceId }],
          workspaceId,
        );

        return updated;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async transitionToNoticePeriod(
    employeeId: string,
    workspaceId: string,
  ): Promise<EmployeeWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
            { shouldBypassPermissionChecks: true },
          );

        const employee = await repository.findOne({
          where: { id: employeeId },
        });

        if (!employee) {
          throw new Error(`Employee ${employeeId} not found`);
        }

        if (employee.status !== EmployeeStatus.ACTIVE) {
          throw new Error(
            `Employee must be ACTIVE to transition to notice period. Current status: ${employee.status}`,
          );
        }

        return (await repository.save({
          ...employee,
          status: EmployeeStatus.NOTICE_PERIOD,
        } as Partial<EmployeeWorkspaceEntity>)) as unknown as EmployeeWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async assignManager(
    employeeId: string,
    managerId: string,
    workspaceId: string,
  ): Promise<EmployeeWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
            { shouldBypassPermissionChecks: true },
          );

        if (employeeId === managerId) {
          throw new Error('Employee cannot be their own manager');
        }

        const employee = await repository.findOne({
          where: { id: employeeId },
        });

        if (!employee) {
          throw new Error(`Employee ${employeeId} not found`);
        }

        return (await repository.save({
          ...employee,
          managerId,
        } as Partial<EmployeeWorkspaceEntity>)) as unknown as EmployeeWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async assignDepartment(
    employeeId: string,
    departmentId: string,
    workspaceId: string,
  ): Promise<EmployeeWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
            { shouldBypassPermissionChecks: true },
          );

        const employee = await repository.findOne({
          where: { id: employeeId },
        });

        if (!employee) {
          throw new Error(`Employee ${employeeId} not found`);
        }

        return (await repository.save({
          ...employee,
          departmentId,
        } as Partial<EmployeeWorkspaceEntity>)) as unknown as EmployeeWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async assignTeam(
    employeeId: string,
    teamId: string,
    workspaceId: string,
  ): Promise<EmployeeWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
            { shouldBypassPermissionChecks: true },
          );

        const employee = await repository.findOne({
          where: { id: employeeId },
        });

        if (!employee) {
          throw new Error(`Employee ${employeeId} not found`);
        }

        return (await repository.save({
          ...employee,
          teamId,
        } as Partial<EmployeeWorkspaceEntity>)) as unknown as EmployeeWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getTeamMembers(
    managerId: string,
    workspaceId: string,
  ): Promise<EmployeeWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
          );

        return repository.find({
          where: { managerId },
        });
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getEmployeesByDepartment(
    departmentId: string,
    workspaceId: string,
  ): Promise<EmployeeWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const repository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
          );

        return repository.find({
          where: { departmentId },
        });
      },
      buildSystemAuthContext(workspaceId),
    );
  }
}
