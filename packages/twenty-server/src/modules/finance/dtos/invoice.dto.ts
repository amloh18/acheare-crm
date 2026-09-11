import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType('RecordPaymentInput')
export class RecordPaymentInputDTO {
  @Field(() => String)
  invoiceId: string;

  @Field(() => Number)
  amount: number;

  @Field(() => String)
  paymentDate: string;

  @Field(() => String, { nullable: true })
  paymentMethod?: string;

  @Field(() => String, { nullable: true })
  reference?: string;
}

@ObjectType('InvoiceSummary')
export class InvoiceSummaryDTO {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  companyId: string | null;

  @Field(() => Number)
  amount: number;

  @Field(() => Number)
  paidAmount: number;

  @Field(() => Number)
  outstanding: number;

  @Field(() => String)
  status: string;

  @Field(() => String, { nullable: true })
  dueDate: string | null;
}

@ObjectType('PaymentResult')
export class PaymentResultDTO {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => Number)
  remainingOutstanding: number;

  @Field(() => String)
  invoiceStatus: string;
}
