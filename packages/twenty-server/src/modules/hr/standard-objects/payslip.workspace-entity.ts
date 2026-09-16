import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type PayrollPeriodWorkspaceEntity } from 'src/modules/hr/standard-objects/payrollPeriod.workspace-entity';
import { type EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { type PayslipLineWorkspaceEntity } from 'src/modules/hr/standard-objects/payslipLine.workspace-entity';
import { type AttachmentWorkspaceEntity } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';

export class PayslipWorkspaceEntity extends BaseWorkspaceEntity {
  currency: string | null;
  grossEarnings: CurrencyMetadata | null;
  totalDeductions: CurrencyMetadata | null;
  totalAdjustments: CurrencyMetadata | null;
  netPay: CurrencyMetadata | null;
  workingDays: number | null;
  presentDays: number | null;
  paidLeaveDays: number | null;
  unpaidLeaveDays: number | null;
  overtimeMinutes: number | null;
  paymentStatus: string | null;
  paidAt: Date | null;
  paymentReference: string | null;
  paymentMethod: string | null;

  payrollPeriod: EntityRelation<PayrollPeriodWorkspaceEntity>;
  payrollPeriodId: string | null;
  employee: EntityRelation<EmployeeWorkspaceEntity>;
  employeeId: string | null;
  lines: EntityRelation<PayslipLineWorkspaceEntity[]> | null;
  attachments: EntityRelation<AttachmentWorkspaceEntity[]> | null;
}
