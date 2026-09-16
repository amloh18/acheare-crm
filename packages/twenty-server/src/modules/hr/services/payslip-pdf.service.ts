import { Injectable, Logger } from '@nestjs/common';
import { createElement, type ReactElement } from 'react';
import {
  renderToBuffer,
  Document,
  type DocumentProps,
  Page,
  StyleSheet,
  Text,
  View,
  Font,
} from '@react-pdf/renderer';
import { type CurrencyMetadata } from 'twenty-shared/types';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import {
  LIBERATION_SANS_REGULAR_BASE64,
  LIBERATION_SANS_BOLD_BASE64,
} from 'src/engine/core-modules/dpa/pdf/fonts/liberation-sans.fonts';
import { PayslipWorkspaceEntity } from 'src/modules/hr/standard-objects/payslip.workspace-entity';
import { PayslipLineWorkspaceEntity } from 'src/modules/hr/standard-objects/payslipLine.workspace-entity';
import { EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { CompanySettingsWorkspaceEntity } from 'src/modules/hr/standard-objects/companySettings.workspace-entity';
import { PayrollPeriodWorkspaceEntity } from 'src/modules/hr/standard-objects/payrollPeriod.workspace-entity';

const FONT_FAMILY = 'Liberation Sans';

let fontsRegistered = false;

const registerFontsOnce = (): void => {
  if (fontsRegistered) {
    return;
  }

  Font.register({
    family: FONT_FAMILY,
    fonts: [
      {
        src: `data:font/ttf;base64,${LIBERATION_SANS_REGULAR_BASE64}`,
        fontWeight: 'normal',
      },
      {
        src: `data:font/ttf;base64,${LIBERATION_SANS_BOLD_BASE64}`,
        fontWeight: 'bold',
      },
    ],
  });

  fontsRegistered = true;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 64,
    paddingHorizontal: 56,
    fontSize: 9,
    fontFamily: FONT_FAMILY,
    lineHeight: 1.5,
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
    paddingBottom: 16,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyInfo: {
    fontSize: 8,
    color: '#666666',
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  payDate: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'right',
  },
  employeeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 4,
  },
  employeeLeft: {
    flex: 1,
  },
  employeeRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 8,
    color: '#888888',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
    color: '#333333',
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
    paddingBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  tableRowEven: {
    backgroundColor: '#fafafa',
  },
  colDescription: {
    flex: 3,
  },
  colAmount: {
    flex: 1,
    textAlign: 'right',
  },
  headerText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#666666',
    textTransform: 'uppercase',
  },
  rowText: {
    fontSize: 9,
  },
  summarySection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    borderTopStyle: 'solid',
    paddingTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    borderTopStyle: 'solid',
  },
  summaryLabel: {
    fontSize: 9,
  },
  summaryValue: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  netPayLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  netPayValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  paymentInfo: {
    marginTop: 16,
    backgroundColor: '#f0f7ff',
    padding: 10,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentStatusLabel: {
    fontSize: 8,
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  paymentStatusValue: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  paymentStatusPaid: {
    color: '#10b981',
  },
  paymentStatusUnpaid: {
    color: '#ef4444',
  },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 56,
    right: 56,
    fontSize: 7,
    color: '#888888',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  daysSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayStat: {
    alignItems: 'center',
  },
  dayStatValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayStatLabel: {
    fontSize: 7,
    color: '#888888',
    textTransform: 'uppercase',
  },
});

interface PayslipPdfData {
  payslip: PayslipWorkspaceEntity;
  lines: PayslipLineWorkspaceEntity[];
  employee: EmployeeWorkspaceEntity;
  companyName: string | null;
  payrollPeriod: PayrollPeriodWorkspaceEntity | null;
}

const formatCurrency = (amountMicros: number | CurrencyMetadata | null, currency: string): string => {
  const amount = ((amountMicros as unknown as number) || 0) / 1_000_000;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
};

const formatDate = (date: Date | null): string => {
  if (!date) return '--';

  return new Date(date as unknown as string).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const buildPayslipPdfDocument = (data: PayslipPdfData): ReactElement<DocumentProps> => {
  registerFontsOnce();

  const { payslip, lines, employee, companyName, payrollPeriod } = data;

  const earnings = lines
    .filter((l) => l.lineType === 'EARNING')
    .sort((a, b) => a.position - b.position);

  const deductions = lines
    .filter((l) => l.lineType === 'DEDUCTION')
    .sort((a, b) => a.position - b.position);

  const adjustments = lines
    .filter((l) => l.lineType === 'ADJUSTMENT')
    .sort((a, b) => a.position - b.position);

  const currency = payslip.currency || 'USD';

  const renderLineItem = (
    line: PayslipLineWorkspaceEntity,
    index: number,
    isLast: boolean,
  ) =>
    createElement(
      View,
      {
        key: `line-${line.id || index}`,
        style: [
          styles.tableRow,
          index % 2 === 0 ? styles.tableRowEven : {},
        ],
        wrap: false,
      },
      createElement(
        Text,
        { style: styles.rowText },
        line.label || '',
      ),
      createElement(
        Text,
        { style: [styles.rowText, styles.colAmount] },
        formatCurrency(line.amount as unknown as number, currency),
      ),
    );

  const renderLineItems = (items: PayslipLineWorkspaceEntity[]) =>
    items.map((line, index) =>
      renderLineItem(line, index, index === items.length - 1),
    );

  const earningsSection =
    earnings.length > 0
      ? createElement(
          View,
          { key: 'earnings' },
          createElement(Text, { style: styles.sectionTitle }, 'Earnings'),
          createElement(
            View,
            { style: styles.tableHeader },
            createElement(Text, { style: styles.headerText }, 'Description'),
            createElement(
              Text,
              { style: [styles.headerText, styles.colAmount] },
              'Amount',
            ),
          ),
          ...renderLineItems(earnings),
        )
      : null;

  const deductionsSection =
    deductions.length > 0
      ? createElement(
          View,
          { key: 'deductions' },
          createElement(Text, { style: styles.sectionTitle }, 'Deductions'),
          createElement(
            View,
            { style: styles.tableHeader },
            createElement(Text, { style: styles.headerText }, 'Description'),
            createElement(
              Text,
              { style: [styles.headerText, styles.colAmount] },
              'Amount',
            ),
          ),
          ...renderLineItems(deductions),
        )
      : null;

  const adjustmentsSection =
    adjustments.length > 0
      ? createElement(
          View,
          { key: 'adjustments' },
          createElement(Text, { style: styles.sectionTitle }, 'Adjustments'),
          createElement(
            View,
            { style: styles.tableHeader },
            createElement(Text, { style: styles.headerText }, 'Description'),
            createElement(
              Text,
              { style: [styles.headerText, styles.colAmount] },
              'Amount',
            ),
          ),
          ...renderLineItems(adjustments),
        )
      : null;

  const summary = createElement(
    View,
    { key: 'summary', style: styles.summarySection },
    createElement(
      View,
      { style: styles.summaryRow },
      createElement(Text, { style: styles.summaryLabel }, 'Gross Earnings'),
      createElement(
        Text,
        { style: styles.summaryValue },
        formatCurrency(payslip.grossEarnings, currency),
      ),
    ),
    createElement(
      View,
      { style: styles.summaryRow },
      createElement(Text, { style: styles.summaryLabel }, 'Total Deductions'),
      createElement(
        Text,
        { style: styles.summaryValue },
        formatCurrency(payslip.totalDeductions, currency),
      ),
    ),
    createElement(
      View,
      { style: styles.summaryRow },
      createElement(Text, { style: styles.summaryLabel }, 'Total Adjustments'),
      createElement(
        Text,
        { style: styles.summaryValue },
        formatCurrency(payslip.totalAdjustments, currency),
      ),
    ),
    createElement(
      View,
      { style: styles.summaryRowTotal },
      createElement(Text, { style: styles.netPayLabel }, 'Net Pay'),
      createElement(
        Text,
        { style: styles.netPayValue },
        formatCurrency(payslip.netPay, currency),
      ),
    ),
  );

  const paymentInfo = createElement(
    View,
    { key: 'payment-info', style: styles.paymentInfo },
    createElement(
      View,
      {},
      createElement(Text, { style: styles.paymentStatusLabel }, 'Payment Status'),
      createElement(
        Text,
        {
          style: [
            styles.paymentStatusValue,
            payslip.paymentStatus === 'PAID'
              ? styles.paymentStatusPaid
              : styles.paymentStatusUnpaid,
          ],
        },
        payslip.paymentStatus || 'UNPAID',
      ),
    ),
    payslip.paidAt
      ? createElement(
          View,
          {},
          createElement(Text, { style: styles.paymentStatusLabel }, 'Paid On'),
          createElement(
            Text,
            { style: styles.paymentStatusValue },
            formatDate(payslip.paidAt),
          ),
        )
      : null,
    payslip.paymentMethod
      ? createElement(
          View,
          {},
          createElement(Text, { style: styles.paymentStatusLabel }, 'Method'),
          createElement(
            Text,
            { style: styles.paymentStatusValue },
            (payslip.paymentMethod || '').replace('_', ' '),
          ),
        )
      : null,
    payslip.paymentReference
      ? createElement(
          View,
          {},
          createElement(Text, { style: styles.paymentStatusLabel }, 'Reference'),
          createElement(
            Text,
            { style: styles.paymentStatusValue },
            payslip.paymentReference,
          ),
        )
      : null,
  );

  const daysSection = createElement(
    View,
    { key: 'days', style: styles.daysSection },
    createElement(
      View,
      { style: styles.dayStat },
      createElement(
        Text,
        { style: styles.dayStatValue },
        String(payslip.workingDays || 0),
      ),
      createElement(Text, { style: styles.dayStatLabel }, 'Working Days'),
    ),
    createElement(
      View,
      { style: styles.dayStat },
      createElement(
        Text,
        { style: styles.dayStatValue },
        String(payslip.presentDays || 0),
      ),
      createElement(Text, { style: styles.dayStatLabel }, 'Present'),
    ),
    createElement(
      View,
      { style: styles.dayStat },
      createElement(
        Text,
        { style: styles.dayStatValue },
        String(payslip.paidLeaveDays || 0),
      ),
      createElement(Text, { style: styles.dayStatLabel }, 'Paid Leave'),
    ),
    createElement(
      View,
      { style: styles.dayStat },
      createElement(
        Text,
        { style: styles.dayStatValue },
        String(payslip.unpaidLeaveDays || 0),
      ),
      createElement(Text, { style: styles.dayStatLabel }, 'Unpaid Leave'),
    ),
    createElement(
      View,
      { style: styles.dayStat },
      createElement(
        Text,
        { style: styles.dayStatValue },
        `${Math.round((payslip.overtimeMinutes || 0) / 60)}h`,
      ),
      createElement(Text, { style: styles.dayStatLabel }, 'Overtime'),
    ),
  );

  const footer = createElement(
    View,
    { style: styles.footer, fixed: true },
    createElement(
      Text,
      {},
      companyName || 'Company',
    ),
    createElement(Text, {}, 'Payslip'),
  );

  const periodName = payrollPeriod?.name || 'Payroll Period';
  const periodRange =
    payrollPeriod?.startDate && payrollPeriod?.endDate
      ? `${formatDate(payrollPeriod.startDate)} - ${formatDate(payrollPeriod.endDate)}`
      : '';

  return createElement(
    Document,
    {
      title: `Payslip - ${employee.employeeCode || 'Employee'}`,
      author: companyName || 'Company',
      subject: `Payslip for ${periodName}`,
    },
    createElement(
      Page,
      { size: 'A4', style: styles.page, wrap: true },
      // Header
      createElement(
        View,
        { style: styles.header },
        createElement(
          View,
          {},
          createElement(Text, { style: styles.companyName }, companyName || 'Company'),
          createElement(
            Text,
            { style: styles.companyInfo },
            `Employee: ${employee.employeeCode || '--'}`,
          ),
        ),
        createElement(
          View,
          {},
          createElement(Text, { style: styles.documentTitle }, 'PAYSLIP'),
          createElement(Text, { style: styles.payDate }, periodName),
          periodRange
            ? createElement(Text, { style: styles.payDate }, periodRange)
            : null,
        ),
      ),
      // Employee info
      createElement(
        View,
        { style: styles.employeeSection },
        createElement(
          View,
          { style: styles.employeeLeft },
          createElement(Text, { style: styles.label }, 'Employee Code'),
          createElement(
            Text,
            { style: styles.value },
            employee.employeeCode || '--',
          ),
          createElement(Text, { style: styles.label }, 'Department'),
          createElement(
            Text,
            { style: styles.value },
            (employee.department as any)?.name || '--',
          ),
        ),
        createElement(
          View,
          { style: styles.employeeRight },
          createElement(Text, { style: styles.label }, 'Designation'),
          createElement(
            Text,
            { style: styles.value },
            (employee.designation as any)?.title || '--',
          ),
          createElement(Text, { style: styles.label }, 'Employment Type'),
          createElement(
            Text,
            { style: styles.value },
            employee.employmentType || '--',
          ),
        ),
      ),
      // Attendance days
      daysSection,
      // Earnings
      earningsSection,
      // Deductions
      deductionsSection,
      // Adjustments
      adjustmentsSection,
      // Summary
      summary,
      // Payment info
      paymentInfo,
      // Footer
      footer,
    ),
  ) as ReactElement<DocumentProps>;
};

@Injectable()
export class PayslipPdfService {
  private readonly logger = new Logger(PayslipPdfService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
  ) {}

  async generatePayslipPdf(
    payslipId: string,
    workspaceId: string,
  ): Promise<Buffer> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const payslipRepository =
          this.workspaceOrmManager.getRepository<PayslipWorkspaceEntity>(
            'payslip',
          );

        const payslipLineRepository =
          this.workspaceOrmManager.getRepository<PayslipLineWorkspaceEntity>(
            'payslipLine',
          );

        const employeeRepository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
          );

        const companySettingsRepository =
          this.workspaceOrmManager.getRepository<CompanySettingsWorkspaceEntity>(
            'companySettings',
            { shouldBypassPermissionChecks: true },
          );

        const payrollPeriodRepository =
          this.workspaceOrmManager.getRepository<PayrollPeriodWorkspaceEntity>(
            'payrollPeriod',
          );

        const payslip = await payslipRepository.findOne({
          where: { id: payslipId },
        });

        if (!payslip) {
          throw new Error(`Payslip ${payslipId} not found`);
        }

        const lines = await payslipLineRepository.find({
          where: { payslipId },
        });

        const employee = await employeeRepository.findOne({
          where: { id: payslip.employeeId! },
        });

        if (!employee) {
          throw new Error(`Employee ${payslip.employeeId} not found`);
        }

        const companySettings = await companySettingsRepository.find({
          where: { isActive: true },
          take: 1,
        });

        const companyName = companySettings[0]?.companyName || null;

        let payrollPeriod: PayrollPeriodWorkspaceEntity | null = null;

        if (payslip.payrollPeriodId) {
          payrollPeriod = await payrollPeriodRepository.findOne({
            where: { id: payslip.payrollPeriodId },
          });
        }

        const documentElement = buildPayslipPdfDocument({
          payslip,
          lines,
          employee,
          companyName,
          payrollPeriod,
        });

        const buffer = await renderToBuffer(documentElement);

        return buffer;
      },
      buildSystemAuthContext(workspaceId),
    );
  }
}
