import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { type AuthContextUser } from 'src/engine/core-modules/auth/types/auth-context.type';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthUser } from 'src/engine/decorators/auth/auth-user.decorator';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { PayrollLifecycleService, PayrollPeriodStatus } from 'src/modules/hr/services/payroll-lifecycle.service';
import {
  CreatePayrollPeriodInputDTO,
  TransitionPayrollPeriodInputDTO,
  CalculatePayrollInputDTO,
  MarkPayslipPaidInputDTO,
  PayrollPeriodDTO,
  PayslipDTO,
  PayrollCalculationResultDTO,
} from 'src/modules/hr/dtos/payroll.dto';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class PayrollResolver {
  constructor(private readonly payrollLifecycleService: PayrollLifecycleService) {}

  @Mutation(() => PayrollPeriodDTO)
  async createPayrollPeriod(
    @Args('input') input: CreatePayrollPeriodInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<PayrollPeriodDTO> {
    const period = await this.payrollLifecycleService.createPayrollPeriod(
      input.name,
      new Date(input.startDate),
      new Date(input.endDate),
      new Date(input.payDate),
      workspace.id,
    );

    return this.mapPayrollPeriod(period);
  }

  @Mutation(() => PayrollPeriodDTO)
  async transitionPayrollPeriodStatus(
    @Args('input') input: TransitionPayrollPeriodInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<PayrollPeriodDTO> {
    const period = await this.payrollLifecycleService.transitionPeriodStatus(
      input.periodId,
      input.newStatus as PayrollPeriodStatus,
      workspace.id,
    );

    return this.mapPayrollPeriod(period);
  }

  @Mutation(() => PayrollCalculationResultDTO)
  async calculatePayroll(
    @Args('input') input: CalculatePayrollInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<PayrollCalculationResultDTO> {
    const result = await this.payrollLifecycleService.calculatePayroll(
      input.periodId,
      input.employeeIds,
      workspace.id,
    );

    return {
      period: this.mapPayrollPeriod(result.period),
      payslipsCreated: result.payslipsCreated,
      errors: result.errors.map((e) => ({
        employeeId: e.employeeId,
        error: e.error,
      })),
    };
  }

  @Mutation(() => PayrollPeriodDTO)
  async approvePayroll(
    @Args('periodId') periodId: string,
    @AuthUser() user: AuthContextUser,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<PayrollPeriodDTO> {
    const period = await this.payrollLifecycleService.approvePayroll(
      periodId,
      user.id,
      workspace.id,
    );

    return this.mapPayrollPeriod(period);
  }

  @Mutation(() => PayrollPeriodDTO)
  async lockPayroll(
    @Args('periodId') periodId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<PayrollPeriodDTO> {
    const period = await this.payrollLifecycleService.lockPayroll(
      periodId,
      workspace.id,
    );

    return this.mapPayrollPeriod(period);
  }

  @Mutation(() => PayslipDTO)
  async markPayslipPaid(
    @Args('input') input: MarkPayslipPaidInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<PayslipDTO> {
    const payslip = await this.payrollLifecycleService.markPayslipPaid(
      input.payslipId,
      input.paymentMethod || 'BANK_TRANSFER',
      input.paymentReference || '',
      workspace.id,
    );

    return this.mapPayslip(payslip);
  }

  @Query(() => [PayslipDTO])
  async payslipsForPeriod(
    @Args('periodId') periodId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<PayslipDTO[]> {
    const payslips = await this.payrollLifecycleService.getPayslipsForPeriod(
      periodId,
      workspace.id,
    );

    return payslips.map((p) => this.mapPayslip(p));
  }

  @Query(() => [PayslipDTO])
  async employeePayslips(
    @Args('employeeId') employeeId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<PayslipDTO[]> {
    const payslips = await this.payrollLifecycleService.getEmployeePayslips(
      employeeId,
      workspace.id,
    );

    return payslips.map((p) => this.mapPayslip(p));
  }

  private mapPayrollPeriod(period: any): PayrollPeriodDTO {
    return {
      id: period.id,
      name: period.name,
      startDate: period.startDate
        ? new Date(period.startDate as unknown as string).toISOString()
        : '',
      endDate: period.endDate
        ? new Date(period.endDate as unknown as string).toISOString()
        : '',
      payDate: period.payDate
        ? new Date(period.payDate as unknown as string).toISOString()
        : '',
      status: period.status,
      employeeCount: period.employeeCount || 0,
      totalGross: period.totalGross || 0,
      totalDeductions: period.totalDeductions || 0,
      totalAdjustments: period.totalAdjustments || 0,
      totalNet: period.totalNet || 0,
    };
  }

  private mapPayslip(payslip: any): PayslipDTO {
    return {
      id: payslip.id,
      employeeId: payslip.employeeId,
      payrollPeriodId: payslip.payrollPeriodId,
      currency: payslip.currency,
      grossEarnings: payslip.grossEarnings || 0,
      totalDeductions: payslip.totalDeductions || 0,
      totalAdjustments: payslip.totalAdjustments || 0,
      netPay: payslip.netPay || 0,
      workingDays: payslip.workingDays || 0,
      presentDays: payslip.presentDays || 0,
      paidLeaveDays: payslip.paidLeaveDays || 0,
      unpaidLeaveDays: payslip.unpaidLeaveDays || 0,
      overtimeMinutes: payslip.overtimeMinutes || 0,
      paymentStatus: payslip.paymentStatus,
      paidAt: payslip.paidAt
        ? new Date(payslip.paidAt as unknown as string).toISOString()
        : null,
      paymentMethod: payslip.paymentMethod || null,
      paymentReference: payslip.paymentReference || null,
    };
  }
}
