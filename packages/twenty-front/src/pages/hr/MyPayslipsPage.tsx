import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useMemo, useCallback, useState } from 'react';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { PageCardHeader } from '@/ui/layout/page/components/PageCardHeader';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconCreditCard,
  IconDownload,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconCoins,
  IconFileText,
} from 'twenty-ui/icon';
import { Button } from 'twenty-ui/input';
import { useMyWorkspaceData } from '@/hr/hooks/useMyWorkspaceData';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${themeCssVariables.spacing[3]};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StyledSummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.md};
`;

const StyledCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledCardIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${themeCssVariables.border.radius.sm};
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
`;

const StyledCardTitle = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledCardValue = styled.span`
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledCardSubtext = styled.span`
  font-size: ${themeCssVariables.font.size.xs};
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledSearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  padding: 0 ${themeCssVariables.spacing[4]};
`;

const StyledSearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[2]};
  flex: 1;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};

  input {
    border: none;
    background: transparent;
    outline: none;
    width: 100%;
    font-size: ${themeCssVariables.font.size.sm};
    color: ${themeCssVariables.font.color.primary};
  }
`;

const StyledTableWrapper = styled.div`
  padding: 0 ${themeCssVariables.spacing[4]};
  overflow-x: auto;
`;

const StyledGrid = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledGridHeader = styled.th`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  text-align: left;
  font-weight: ${themeCssVariables.font.weight.medium};
  color: ${themeCssVariables.font.color.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledGridCell = styled.td`
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledStatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};

  ${({ $status }) => {
    switch ($status) {
      case 'PAID':
        return `
          background: #10b98115;
          color: #10b981;
        `;
      case 'PENDING':
        return `
          background: #f59e0b15;
          color: #f59e0b;
        `;
      case 'PROCESSING':
        return `
          background: #3b82f615;
          color: #3b82f6;
        `;
      default:
        return `
          background: ${themeCssVariables.background.secondary};
          color: ${themeCssVariables.font.color.secondary};
        `;
    }
  }}
`;

const StyledPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  border-top: 1px solid ${themeCssVariables.border.color.light};
`;

const StyledPaginationInfo = styled.span`
  font-size: ${themeCssVariables.font.size.sm};
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledPaginationButtons = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledPageButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};

  ${({ $active }) =>
    $active
      ? `
    background: ${themeCssVariables.font.color.primary};
    color: ${themeCssVariables.background.primary};
    border-color: ${themeCssVariables.font.color.primary};
  `
      : `
    background: ${themeCssVariables.background.primary};
    color: ${themeCssVariables.font.color.primary};
    
    &:hover {
      background: ${themeCssVariables.background.secondary};
    }
  `}
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${themeCssVariables.spacing[8]};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const ITEMS_PER_PAGE = 10;

const formatCurrency = (amountMicros: number, currencyCode?: string) => {
  const amount = amountMicros / 1_000_000;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
  }).format(amount);
};

export const MyPayslipsPage = () => {
  const { t } = useLingui();
  const { enqueueSuccessSnackBar } = useSnackBar();
  const { data: myWorkspaceData } = useMyWorkspaceData() as { data: any };

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const payslips = useMemo(
    () => myWorkspaceData?.myWorkspaceData?.recentPayslipList || [],
    [myWorkspaceData],
  );

  const filteredPayslips = useMemo(() => {
    if (!searchQuery) return payslips;
    const query = searchQuery.toLowerCase();
    return payslips.filter(
      (payslip: any) =>
        payslip.id?.toLowerCase().includes(query) ||
        payslip.paymentStatus?.toLowerCase().includes(query),
    );
  }, [payslips, searchQuery]);

  const paginatedPayslips = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayslips.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPayslips, currentPage]);

  const totalPages = Math.ceil(filteredPayslips.length / ITEMS_PER_PAGE);

  const totalNetPay = useMemo(
    () =>
      payslips.reduce(
        (sum: number, p: any) => sum + (p.netPayAmountMicros || 0),
        0,
      ),
    [payslips],
  );

  const paidCount = useMemo(
    () => payslips.filter((p: any) => p.paymentStatus === 'PAID').length,
    [payslips],
  );

  const handleExport = useCallback(() => {
    if (payslips.length === 0) return;

    const csvContent = [
      ['Period', 'Net Pay', 'Currency', 'Status', 'Paid At'],
      ...payslips.map((p: any) => [
        p.payrollPeriodId || '',
        (p.netPayAmountMicros / 1_000_000).toFixed(2),
        p.currencyCode || 'USD',
        p.paymentStatus || '',
        p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslips-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    enqueueSuccessSnackBar({ message: t`Payslips exported` });
  }, [payslips, enqueueSuccessSnackBar, t]);

  return (
    <PageContainer>
      <PageCardLayout
        header={
          <PageCardHeader
            icon={<IconCreditCard size={themeCssVariables.icon.size.md} />}
            title={t`My Payslips`}
            actionButton={
              <Button
                variant="secondary"
                Icon={IconDownload}
                onClick={handleExport}
                title={t`Download`}
              />
            }
          />
        }
      >
        <StyledContent>
          <StyledSummaryGrid>
            <StyledSummaryCard>
              <StyledCardHeader>
                <StyledCardIcon $color="#3b82f6">
                  <IconFileText size={16} />
                </StyledCardIcon>
                <StyledCardTitle>{t`Total Payslips`}</StyledCardTitle>
              </StyledCardHeader>
              <StyledCardValue>{payslips.length}</StyledCardValue>
              <StyledCardSubtext>{t`All time`}</StyledCardSubtext>
            </StyledSummaryCard>

            <StyledSummaryCard>
              <StyledCardHeader>
                <StyledCardIcon $color="#10b981">
                  <IconCoins size={16} />
                </StyledCardIcon>
                <StyledCardTitle>{t`Total Net Pay`}</StyledCardTitle>
              </StyledCardHeader>
              <StyledCardValue>{formatCurrency(totalNetPay)}</StyledCardValue>
              <StyledCardSubtext>{t`Combined earnings`}</StyledCardSubtext>
            </StyledSummaryCard>

            <StyledSummaryCard>
              <StyledCardHeader>
                <StyledCardIcon $color="#10b981">
                  <IconCreditCard size={16} />
                </StyledCardIcon>
                <StyledCardTitle>{t`Paid`}</StyledCardTitle>
              </StyledCardHeader>
              <StyledCardValue>{paidCount}</StyledCardValue>
              <StyledCardSubtext>{t`Payslips paid`}</StyledCardSubtext>
            </StyledSummaryCard>
          </StyledSummaryGrid>

          <StyledSearchBar>
            <StyledSearchInput>
              <IconSearch size={16} />
              <input
                type="text"
                placeholder={t`Search payslips...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </StyledSearchInput>
          </StyledSearchBar>

          <StyledTableWrapper>
            <StyledGrid>
              <thead>
                <tr>
                  <StyledGridHeader>{t`Period`}</StyledGridHeader>
                  <StyledGridHeader>{t`Net Pay`}</StyledGridHeader>
                  <StyledGridHeader>{t`Currency`}</StyledGridHeader>
                  <StyledGridHeader>{t`Status`}</StyledGridHeader>
                  <StyledGridHeader>{t`Paid At`}</StyledGridHeader>
                </tr>
              </thead>
              <tbody>
                {paginatedPayslips.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <StyledEmptyState>
                        {t`No payslips found`}
                      </StyledEmptyState>
                    </td>
                  </tr>
                ) : (
                  paginatedPayslips.map((payslip: any) => (
                    <tr key={payslip.id}>
                      <StyledGridCell>
                        {payslip.payrollPeriodId || '--'}
                      </StyledGridCell>
                      <StyledGridCell>
                        {formatCurrency(
                          payslip.netPayAmountMicros || 0,
                          payslip.currencyCode,
                        )}
                      </StyledGridCell>
                      <StyledGridCell>
                        {payslip.currencyCode || 'USD'}
                      </StyledGridCell>
                      <StyledGridCell>
                        <StyledStatusBadge
                          $status={payslip.paymentStatus || 'PENDING'}
                        >
                          {payslip.paymentStatus || 'PENDING'}
                        </StyledStatusBadge>
                      </StyledGridCell>
                      <StyledGridCell>
                        {payslip.paidAt
                          ? new Date(payslip.paidAt).toLocaleDateString()
                          : '--'}
                      </StyledGridCell>
                    </tr>
                  ))
                )}
              </tbody>
            </StyledGrid>
          </StyledTableWrapper>

          {filteredPayslips.length > ITEMS_PER_PAGE && (
            <StyledPagination>
              <StyledPaginationInfo>
                {t`Show ${paginatedPayslips.length} from ${filteredPayslips.length} data`}
              </StyledPaginationInfo>
              <StyledPaginationButtons>
                <StyledPageButton
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft size={16} />
                </StyledPageButton>
                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <StyledPageButton
                    key={page}
                    $active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </StyledPageButton>
                ))}
                <StyledPageButton
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <IconChevronRight size={16} />
                </StyledPageButton>
              </StyledPaginationButtons>
            </StyledPagination>
          )}
        </StyledContent>
      </PageCardLayout>
    </PageContainer>
  );
};
