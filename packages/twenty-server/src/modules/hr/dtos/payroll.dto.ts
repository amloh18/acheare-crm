import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('CreatePayrollPeriodInput')
export class CreatePayrollPeriodInputDTO {
  @Field(() => String)
  name: string;

  @Field(() => String)
  startDate: string;

  @Field(() => String)
  endDate: string;

  @Field(() => String)
  payDate: string;
}

@InputType('TransitionPayrollPeriodInput')
export class TransitionPayrollPeriodInputDTO {
  @Field(() => String)
  periodId: string;

  @Field(() => String)
  newStatus: string;
}

@InputType('CalculatePayrollInput')
export class CalculatePayrollInputDTO {
  @Field(() => String)
  periodId: string;

  @Field(() => [String])
  employeeIds: string[];
}

@InputType('MarkPayslipPaidInput')
export class MarkPayslipPaidInputDTO {
  @Field(() => String)
  payslipId: string;

  @Field(() => String, { nullable: true })
  paymentMethod?: string;

  @Field(() => String, { nullable: true })
  paymentReference?: string;
}

@ObjectType('PayrollPeriod')
export class PayrollPeriodDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  startDate: string;

  @Field(() => String)
  endDate: string;

  @Field(() => String)
  payDate: string;

  @Field(() => String)
  status: string;

  @Field(() => Number)
  employeeCount: number;

  @Field(() => Number)
  totalGross: number;

  @Field(() => Number)
  totalDeductions: number;

  @Field(() => Number)
  totalAdjustments: number;

  @Field(() => Number)
  totalNet: number;
}

@ObjectType('PayslipLine')
export class PayslipLineDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  payslipId: string;

  @Field(() => String)
  label: string;

  @Field(() => String)
  lineType: string;

  @Field(() => Number)
  amount: number;

  @Field(() => Number)
  position: number;
}

@ObjectType('Payslip')
export class PayslipDTO {
  @Field(() => String)
  id: string;

  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  payrollPeriodId: string;

  @Field(() => String)
  currency: string;

  @Field(() => Number)
  grossEarnings: number;

  @Field(() => Number)
  totalDeductions: number;

  @Field(() => Number)
  totalAdjustments: number;

  @Field(() => Number)
  netPay: number;

  @Field(() => Number)
  workingDays: number;

  @Field(() => Number)
  presentDays: number;

  @Field(() => Number)
  paidLeaveDays: number;

  @Field(() => Number)
  unpaidLeaveDays: number;

  @Field(() => Number)
  overtimeMinutes: number;

  @Field(() => String)
  paymentStatus: string;

  @Field(() => String, { nullable: true })
  paidAt: string | null;

  @Field(() => String, { nullable: true })
  paymentMethod: string | null;

  @Field(() => String, { nullable: true })
  paymentReference: string | null;
}

@ObjectType('PayrollError')
export class PayrollErrorDTO {
  @Field(() => String)
  employeeId: string;

  @Field(() => String)
  error: string;
}

@ObjectType('PayrollCalculationResult')
export class PayrollCalculationResultDTO {
  @Field(() => PayrollPeriodDTO)
  period: PayrollPeriodDTO;

  @Field(() => Number)
  payslipsCreated: number;

  @Field(() => [PayrollErrorDTO])
  errors: PayrollErrorDTO[];
}

@ObjectType('PayslipPdfResult')
export class PayslipPdfResultDTO {
  @Field(() => String)
  base64Data: string;

  @Field(() => String)
  fileName: string;
}
