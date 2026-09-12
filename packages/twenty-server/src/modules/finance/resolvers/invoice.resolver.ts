import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { UserAuthGuard } from 'src/engine/guards/user-auth.guard';
import { InvoiceService, InvoiceStatus } from 'src/modules/finance/services/invoice.service';
import {
  RecordPaymentInputDTO,
  InvoiceSummaryDTO,
  PaymentResultDTO,
} from 'src/modules/finance/dtos/invoice.dto';

@UseGuards(WorkspaceAuthGuard, UserAuthGuard)
@UsePipes(ResolverValidationPipe)
@UseFilters(PreventNestToAutoLogGraphqlErrorsFilter)
@MetadataResolver()
export class InvoiceResolver {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Mutation(() => InvoiceSummaryDTO)
  async createInvoice(
    @Args('companyId') companyId: string,
    @Args('amount') amount: number,
    @Args('invoiceDate') invoiceDate: string,
    @Args('dueDate') dueDate: string,
    // The explicit `type` keeps Nest's design:paramtypes reflection a scalar
    // instead of Object (a `string | undefined` TS type reflects as Object,
    // which makes every GraphQL schema build — including the migration CLI —
    // throw UndefinedTypeError).
    @Args('opportunityId', { type: () => String, nullable: true })
    opportunityId: string | undefined,
    @Args('requirementId', { type: () => String, nullable: true })
    requirementId: string | undefined,
    @Args('notes', { type: () => String, nullable: true })
    notes: string | undefined,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<InvoiceSummaryDTO> {
    const invoice = await this.invoiceService.createInvoice(
      companyId,
      amount,
      new Date(invoiceDate),
      new Date(dueDate),
      opportunityId,
      requirementId,
      notes,
      workspace.id,
    );

    return this.mapInvoice(invoice);
  }

  @Mutation(() => PaymentResultDTO)
  async recordPayment(
    @Args('input') input: RecordPaymentInputDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<PaymentResultDTO> {
    const payment = await this.invoiceService.recordPayment(
      input.invoiceId,
      input.amount,
      new Date(input.paymentDate),
      input.paymentMethod || 'BANK_TRANSFER',
      input.reference,
      undefined,
      workspace.id,
    );

    const invoice = await this.invoiceService.getInvoicePayments(
      input.invoiceId,
      workspace.id,
    );

    return {
      success: true,
      remainingOutstanding: 0,
      invoiceStatus: 'PAID',
    };
  }

  @Mutation(() => InvoiceSummaryDTO)
  async updateInvoiceStatus(
    @Args('invoiceId') invoiceId: string,
    @Args('status') status: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<InvoiceSummaryDTO> {
    const invoice = await this.invoiceService.updateInvoiceStatus(
      invoiceId,
      status as InvoiceStatus,
      workspace.id,
    );

    return this.mapInvoice(invoice);
  }

  @Query(() => [InvoiceSummaryDTO])
  async overdueInvoices(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<InvoiceSummaryDTO[]> {
    const invoices = await this.invoiceService.checkOverdueInvoices(
      workspace.id,
    );

    return invoices.map((i) => this.mapInvoice(i));
  }

  @Query(() => InvoiceSummaryDTO)
  async outstandingForCompany(
    @Args('companyId') companyId: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<any> {
    const result = await this.invoiceService.getOutstandingForCompany(
      companyId,
      workspace.id,
    );

    return result;
  }

  private mapInvoice(invoice: any): InvoiceSummaryDTO {
    return {
      id: invoice.id,
      companyId: invoice.companyId || null,
      amount: (invoice.amount as unknown as number) || 0,
      paidAmount: (invoice.amountPaid as unknown as number) || 0,
      outstanding: (invoice.outstanding as unknown as number) || 0,
      status: invoice.status,
      dueDate: invoice.dueDate
        ? new Date(invoice.dueDate as unknown as string).toISOString()
        : null,
    };
  }
}
