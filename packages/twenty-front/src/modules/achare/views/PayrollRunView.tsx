import { useState } from 'react';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconPlus,
  IconCoins,
  IconCreditCard,
  IconCheck,
  IconFileText,
  IconDownload,
} from 'twenty-ui/icon';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  width: 100%;
  box-sizing: border-box;
`;

const StyledHeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const StyledHeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledMainHeading = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
  margin: 0;
`;

const StyledSubHeading = styled.div`
  font-size: 0.8125rem;
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid
    ${({ variant }) =>
      variant === 'primary'
        ? themeCssVariables.font.color.primary
        : themeCssVariables.border.color.medium};
  background: ${({ variant }) =>
    variant === 'primary'
      ? themeCssVariables.font.color.primary
      : themeCssVariables.background.primary};
  color: ${({ variant }) =>
    variant === 'primary'
      ? themeCssVariables.background.primary
      : themeCssVariables.font.color.primary};
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const StyledKPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledStatCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledStatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledStatLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${themeCssVariables.font.color.tertiary};
  text-transform: uppercase;
`;

const StyledPeriodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledPeriodCard = styled.div<{ isSelected: boolean }>`
  background: ${themeCssVariables.background.primary};
  border: 1px solid
    ${({ isSelected }) =>
      isSelected
        ? themeCssVariables.font.color.primary
        : themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  padding: ${themeCssVariables.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

const StyledPeriodTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledPeriodTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${themeCssVariables.font.color.primary};
`;

const StyledStatusBadge = styled.span<{ status: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  background: ${({ status }) =>
    status === 'PAID' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)'};
  color: ${({ status }) => (status === 'PAID' ? '#10b981' : '#f59e0b')};
`;

const StyledTableWrap = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  text-align: left;
`;

const StyledTh = styled.th`
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  background: ${themeCssVariables.background.secondary};
  color: ${themeCssVariables.font.color.tertiary};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledTd = styled.td`
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  color: ${themeCssVariables.font.color.primary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  vertical-align: middle;
`;

const StyledTr = styled.tr`
  &:last-of-type ${StyledTd} {
    border-bottom: none;
  }
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const PAYROLL_PERIODS = [
  {
    id: 'p-1',
    name: 'August 2026 Cycle',
    dates: 'Aug 01 – Aug 31, 2026',
    netTotal: '₹1,24,50,000',
    employees: 48,
    status: 'PAID',
  },
  {
    id: 'p-2',
    name: 'July 2026 Cycle',
    dates: 'Jul 01 – Jul 31, 2026',
    netTotal: '₹1,18,20,000',
    employees: 45,
    status: 'PAID',
  },
  {
    id: 'p-3',
    name: 'September 2026 Cycle',
    dates: 'Sep 01 – Sep 30, 2026',
    netTotal: '₹1,26,00,000 (Est)',
    employees: 48,
    status: 'PROCESSING',
  },
];

const PAYSLIP_ENTRIES = [
  {
    id: 'ps-1',
    employee: 'Aarav Patel',
    designation: 'Principal Engineer',
    gross: '₹3,20,000',
    deductions: '₹42,000',
    net: '₹2,78,000',
    paymentStatus: 'PAID',
  },
  {
    id: 'ps-2',
    employee: 'Rohan Mehta',
    designation: 'Staff Product Designer',
    gross: '₹2,80,000',
    deductions: '₹36,000',
    net: '₹2,44,000',
    paymentStatus: 'PAID',
  },
  {
    id: 'ps-3',
    employee: 'Kavita Sundaram',
    designation: 'VP of Sales',
    gross: '₹3,50,000',
    deductions: '₹48,000',
    net: '₹3,02,000',
    paymentStatus: 'PAID',
  },
  {
    id: 'ps-4',
    employee: 'Vikram Sengupta',
    designation: 'Head of People Operations',
    gross: '₹2,40,000',
    deductions: '₹30,000',
    net: '₹2,10,000',
    paymentStatus: 'PAID',
  },
  {
    id: 'ps-5',
    employee: 'Sneha Kulkarni',
    designation: 'Lead DevOps Specialist',
    gross: '₹2,60,000',
    deductions: '₹33,000',
    net: '₹2,27,000',
    paymentStatus: 'PAID',
  },
];

export const PayrollRunView = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(PAYROLL_PERIODS[0].id);
  const { enqueueSuccessSnackBar } = useSnackBar();

  const handleRunPayroll = () => {
    enqueueSuccessSnackBar({ message: 'Payroll calculation cycle triggered' });
  };

  const handleDownload = (employee: string) => {
    enqueueSuccessSnackBar({ message: `Downloaded payslip for ${employee}` });
  };

  return (
    <StyledContainer>
      <StyledHeaderRow>
        <StyledHeaderTitle>
          <StyledMainHeading>Payroll & Compensation Cycles</StyledMainHeading>
          <StyledSubHeading>
            Execute monthly disbursement, manage payslips and statutory deductions
          </StyledSubHeading>
        </StyledHeaderTitle>

        <StyledControls>
          <StyledButton variant="primary" onClick={handleRunPayroll}>
            <IconPlus size={14} />
            <span>Process New Payroll</span>
          </StyledButton>
        </StyledControls>
      </StyledHeaderRow>

      <StyledKPIGrid>
        <StyledStatCard>
          <StyledStatValue>₹1.24 Cr</StyledStatValue>
          <StyledStatLabel>Net Disbursed (August 2026)</StyledStatLabel>
        </StyledStatCard>
        <StyledStatCard>
          <StyledStatValue>48 / 48</StyledStatValue>
          <StyledStatLabel>Staff Disbursed (100%)</StyledStatLabel>
        </StyledStatCard>
        <StyledStatCard>
          <StyledStatValue>₹18.4 Lakh</StyledStatValue>
          <StyledStatLabel>TDS & Statutory Withholdings</StyledStatLabel>
        </StyledStatCard>
        <StyledStatCard>
          <StyledStatValue style={{ color: '#10b981' }}>Compliant</StyledStatValue>
          <StyledStatLabel>PF & ESI Automated Filing</StyledStatLabel>
        </StyledStatCard>
      </StyledKPIGrid>

      <StyledPeriodsGrid>
        {PAYROLL_PERIODS.map((period) => (
          <StyledPeriodCard
            key={period.id}
            isSelected={selectedPeriod === period.id}
            onClick={() => setSelectedPeriod(period.id)}
          >
            <StyledPeriodTop>
              <StyledPeriodTitle>{period.name}</StyledPeriodTitle>
              <StyledStatusBadge status={period.status}>
                {period.status}
              </StyledStatusBadge>
            </StyledPeriodTop>
            <div style={{ fontSize: '0.75rem', color: themeCssVariables.font.color.tertiary }}>
              {period.dates}
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: themeCssVariables.font.color.primary }}>
              {period.netTotal}
            </div>
          </StyledPeriodCard>
        ))}
      </StyledPeriodsGrid>

      <StyledTableWrap>
        <StyledTable>
          <thead>
            <tr>
              <StyledTh>Employee</StyledTh>
              <StyledTh>Designation</StyledTh>
              <StyledTh>Gross Earnings</StyledTh>
              <StyledTh>Deductions (Tax/PF)</StyledTh>
              <StyledTh>Net Pay</StyledTh>
              <StyledTh>Status</StyledTh>
              <StyledTh>Action</StyledTh>
            </tr>
          </thead>
          <tbody>
            {PAYSLIP_ENTRIES.map((row) => (
              <StyledTr key={row.id}>
                <StyledTd>
                  <strong>{row.employee}</strong>
                </StyledTd>
                <StyledTd>{row.designation}</StyledTd>
                <StyledTd>{row.gross}</StyledTd>
                <StyledTd style={{ color: '#ef4444' }}>-{row.deductions}</StyledTd>
                <StyledTd>
                  <strong>{row.net}</strong>
                </StyledTd>
                <StyledTd>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      color: '#10b981',
                      fontWeight: 600,
                    }}
                  >
                    <IconCheck size={12} /> Paid
                  </span>
                </StyledTd>
                <StyledTd>
                  <button
                    onClick={() => handleDownload(row.employee)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 8px',
                      background: 'none',
                      border: `1px solid ${themeCssVariables.border.color.light}`,
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      color: themeCssVariables.font.color.secondary,
                    }}
                  >
                    <IconDownload size={12} />
                    <span>Payslip</span>
                  </button>
                </StyledTd>
              </StyledTr>
            ))}
          </tbody>
        </StyledTable>
      </StyledTableWrap>
    </StyledContainer>
  );
};
