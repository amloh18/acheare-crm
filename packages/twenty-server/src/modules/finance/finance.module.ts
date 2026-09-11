import { Module } from '@nestjs/common';

import { InvoiceService } from 'src/modules/finance/services/invoice.service';

@Module({
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class FinanceModule {}
