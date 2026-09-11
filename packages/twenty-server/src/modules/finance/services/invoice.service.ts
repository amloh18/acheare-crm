import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { InvoiceWorkspaceEntity } from 'src/modules/hr/standard-objects/invoice.workspace-entity';
import { PaymentWorkspaceEntity } from 'src/modules/hr/standard-objects/payment.workspace-entity';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
  ) {}

  async createInvoice(
    companyId: string,
    amount: number,
    invoiceDate: Date,
    dueDate: Date,
    opportunityId?: string,
    requirementId?: string,
    notes?: string,
    workspaceId?: string,
  ): Promise<InvoiceWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const invoiceRepository =
          this.workspaceOrmManager.getRepository<InvoiceWorkspaceEntity>(
            'invoice',
            { shouldBypassPermissionChecks: true },
          );

        const invoiceNumber = await this.generateInvoiceNumber(workspaceId);

        return (await invoiceRepository.save({
          invoiceNumber,
          companyId,
          amount,
          invoiceDate,
          dueDate,
          status: InvoiceStatus.DRAFT,
          amountPaid: 0,
          outstanding: amount,
          dealId: opportunityId || null,
          requirementId: requirementId || null,
          notes: notes || null,
        } as unknown as Partial<InvoiceWorkspaceEntity>)) as unknown as InvoiceWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId!),
    );
  }

  async recordPayment(
    invoiceId: string,
    amount: number,
    paidDate: Date,
    method: string,
    reference?: string,
    notes?: string,
    workspaceId?: string,
  ): Promise<PaymentWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const invoiceRepository =
          this.workspaceOrmManager.getRepository<InvoiceWorkspaceEntity>(
            'invoice',
            { shouldBypassPermissionChecks: true },
          );

        const paymentRepository =
          this.workspaceOrmManager.getRepository<PaymentWorkspaceEntity>(
            'payment',
            { shouldBypassPermissionChecks: true },
          );

        const invoice = await invoiceRepository.findOne({
          where: { id: invoiceId },
        });

        if (!invoice) {
          throw new Error(`Invoice ${invoiceId} not found`);
        }

        const invoiceAmount = (invoice.amount as unknown as number) || 0;
        const currentPaid = (invoice.amountPaid as unknown as number) || 0;

        if (currentPaid + amount > invoiceAmount) {
          throw new Error(
            `Payment amount (${amount}) exceeds outstanding (${invoiceAmount - currentPaid})`,
          );
        }

        const payment = (await paymentRepository.save({
          invoiceId,
          amount,
          paidDate,
          method,
          reference: reference || null,
          notes: notes || null,
        } as unknown as Partial<PaymentWorkspaceEntity>)) as unknown as PaymentWorkspaceEntity;

        const newAmountPaid = currentPaid + amount;
        const newOutstanding = invoiceAmount - newAmountPaid;

        let newStatus: string;
        if (newOutstanding <= 0) {
          newStatus = InvoiceStatus.PAID;
        } else {
          newStatus = InvoiceStatus.PARTIALLY_PAID;
        }

        await invoiceRepository.save({
          ...invoice,
          amountPaid: newAmountPaid,
          outstanding: newOutstanding,
          status: newStatus,
        } as unknown as Partial<InvoiceWorkspaceEntity>);

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'finance_paymentRecorded',
          [
            {
              invoiceId,
              paymentId: payment.id,
              amount,
              workspaceId,
            },
          ],
          workspaceId,
        );

        return payment;
      },
      buildSystemAuthContext(workspaceId!),
    );
  }

  async updateInvoiceStatus(
    invoiceId: string,
    status: InvoiceStatus,
    workspaceId: string,
  ): Promise<InvoiceWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const invoiceRepository =
          this.workspaceOrmManager.getRepository<InvoiceWorkspaceEntity>(
            'invoice',
            { shouldBypassPermissionChecks: true },
          );

        const invoice = await invoiceRepository.findOne({
          where: { id: invoiceId },
        });

        if (!invoice) {
          throw new Error(`Invoice ${invoiceId} not found`);
        }

        return (await invoiceRepository.save({
          ...invoice,
          status,
        } as unknown as Partial<InvoiceWorkspaceEntity>)) as unknown as InvoiceWorkspaceEntity;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async checkOverdueInvoices(
    workspaceId: string,
  ): Promise<InvoiceWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const invoiceRepository =
          this.workspaceOrmManager.getRepository<InvoiceWorkspaceEntity>(
            'invoice',
            { shouldBypassPermissionChecks: true },
          );

        const now = new Date();

        const invoices = await invoiceRepository.find({
          where: {},
        });

        const overdue: InvoiceWorkspaceEntity[] = [];

        for (const invoice of invoices) {
          if (
            invoice.dueDate &&
            new Date(invoice.dueDate) < now &&
            invoice.status !== InvoiceStatus.PAID &&
            invoice.status !== InvoiceStatus.CANCELLED
          ) {
            await invoiceRepository.save({
              ...invoice,
              status: InvoiceStatus.OVERDUE,
            } as unknown as Partial<InvoiceWorkspaceEntity>);

            overdue.push(invoice);
          }
        }

        return overdue;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getOutstandingForCompany(
    companyId: string,
    workspaceId: string,
  ): Promise<{
    totalOutstanding: number;
    invoiceCount: number;
    overdueCount: number;
  }> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const invoiceRepository =
          this.workspaceOrmManager.getRepository<InvoiceWorkspaceEntity>(
            'invoice',
          );

        const invoices = await invoiceRepository.find({
          where: { companyId },
        });

        const activeInvoices = invoices.filter(
          (i) =>
            i.status !== InvoiceStatus.CANCELLED &&
            i.status !== InvoiceStatus.PAID,
        );

        return {
          totalOutstanding: activeInvoices.reduce(
            (sum, i) => sum + ((i.outstanding as unknown as number) || 0),
            0,
          ),
          invoiceCount: activeInvoices.length,
          overdueCount: activeInvoices.filter(
            (i) => i.status === InvoiceStatus.OVERDUE,
          ).length,
        };
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getInvoicePayments(
    invoiceId: string,
    workspaceId: string,
  ): Promise<PaymentWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const paymentRepository =
          this.workspaceOrmManager.getRepository<PaymentWorkspaceEntity>(
            'payment',
          );

        return paymentRepository.find({
          where: { invoiceId },
        });
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  private async generateInvoiceNumber(
    workspaceId?: string,
  ): Promise<string> {
    const invoiceRepository =
      this.workspaceOrmManager.getRepository<InvoiceWorkspaceEntity>(
        'invoice',
        { shouldBypassPermissionChecks: true },
      );

    const count = await invoiceRepository.count();
    const nextNum = count + 1;

    return `INV-${String(nextNum).padStart(5, '0')}`;
  }
}
