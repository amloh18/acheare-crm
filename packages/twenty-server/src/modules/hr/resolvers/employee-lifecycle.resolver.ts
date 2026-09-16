import { SetMetadata, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { AchareRoleGuard, ROLES_KEY } from 'src/modules/hr/guards/achare-role.guard';
import { EmployeeLifecycleService } from 'src/modules/hr/services/employee-lifecycle.service';
import {
  ActivateEmployeeInputDTO,
  DeactivateEmployeeInputDTO,
  TransitionEmployeeStatusInputDTO,
  AssignManagerInputDTO,
  AssignDepartmentInputDTO,
  AssignTeamInputDTO,
  EmployeeDTO,
} from 'src/modules/hr/dtos/employee-lifecycle.dto';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class EmployeeLifecycleResolver {
  constructor(private readonly employeeLifecycleService: EmployeeLifecycleService) {}

  @UseGuards(AchareRoleGuard)
  @SetMetadata(ROLES_KEY, ['admin', 'hr'])
  @Mutation(() => EmployeeDTO)
  async activateEmployee(
    @Args('input') input: ActivateEmployeeInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<EmployeeDTO> {
    const employee = await this.employeeLifecycleService.activateEmployee(
      input.employeeId,
      workspace.id,
    );

    return this.mapEmployee(employee);
  }

  @UseGuards(AchareRoleGuard)
  @SetMetadata(ROLES_KEY, ['admin', 'hr'])
  @Mutation(() => EmployeeDTO)
  async deactivateEmployee(
    @Args('input') input: DeactivateEmployeeInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<EmployeeDTO> {
    const employee = await this.employeeLifecycleService.deactivateEmployee(
      input.employeeId,
      input.reason,
      workspace.id,
    );

    return this.mapEmployee(employee);
  }

  @Mutation(() => EmployeeDTO)
  async transitionToNoticePeriod(
    @Args('input') input: TransitionEmployeeStatusInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<EmployeeDTO> {
    const employee = await this.employeeLifecycleService.transitionToNoticePeriod(
      input.employeeId,
      workspace.id,
    );

    return this.mapEmployee(employee);
  }

  @Mutation(() => EmployeeDTO)
  async assignManager(
    @Args('input') input: AssignManagerInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<EmployeeDTO> {
    const employee = await this.employeeLifecycleService.assignManager(
      input.employeeId,
      input.managerId,
      workspace.id,
    );

    return this.mapEmployee(employee);
  }

  @Mutation(() => EmployeeDTO)
  async assignDepartment(
    @Args('input') input: AssignDepartmentInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<EmployeeDTO> {
    const employee = await this.employeeLifecycleService.assignDepartment(
      input.employeeId,
      input.departmentId,
      workspace.id,
    );

    return this.mapEmployee(employee);
  }

  @Mutation(() => EmployeeDTO)
  async assignTeam(
    @Args('input') input: AssignTeamInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<EmployeeDTO> {
    const employee = await this.employeeLifecycleService.assignTeam(
      input.employeeId,
      input.teamId,
      workspace.id,
    );

    return this.mapEmployee(employee);
  }

  @Query(() => [EmployeeDTO])
  async teamMembers(
    @Args('managerId') managerId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<EmployeeDTO[]> {
    const members = await this.employeeLifecycleService.getTeamMembers(
      managerId,
      workspace.id,
    );

    return members.map((e) => this.mapEmployee(e));
  }

  @Query(() => [EmployeeDTO])
  async employeesByDepartment(
    @Args('departmentId') departmentId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<EmployeeDTO[]> {
    const employees = await this.employeeLifecycleService.getEmployeesByDepartment(
      departmentId,
      workspace.id,
    );

    return employees.map((e) => this.mapEmployee(e));
  }

  private mapEmployee(employee: any): EmployeeDTO {
    return {
      id: employee.id,
      employeeCode: employee.employeeCode || null,
      status: employee.status || null,
      employmentType: employee.employmentType || null,
      joiningDate: employee.joiningDate
        ? new Date(employee.joiningDate as unknown as string).toISOString()
        : null,
      exitDate: employee.exitDate
        ? new Date(employee.exitDate as unknown as string).toISOString()
        : null,
      personId: employee.personId || null,
      departmentId: employee.departmentId || null,
      teamId: employee.teamId || null,
      designationId: employee.designationId || null,
      locationId: employee.locationId || null,
      managerId: employee.managerId || null,
    };
  }
}
