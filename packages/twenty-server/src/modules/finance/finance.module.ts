import { Module } from '@nestjs/common';

import { InvoiceService } from 'src/modules/finance/services/invoice.service';
import { InvoiceResolver } from 'src/modules/finance/resolvers/invoice.resolver';

@Module({
  providers: [InvoiceService, InvoiceResolver],
  exports: [InvoiceService],
})
export class FinanceModule {}
