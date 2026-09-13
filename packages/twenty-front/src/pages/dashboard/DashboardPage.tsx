import { styled } from '@linaria/react';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { Section } from 'twenty-ui/layout';
import { themeCssVariables } from 'twenty-ui/theme-constants';
import {
  IconTargetArrow,
  IconBriefcase,
  IconUsers,
  IconClock,
  IconCoins,
  IconCalendarEvent,
  IconTrendingUp,
  IconCheckbox,
} from 'twenty-ui/icon';

import { useAchareRole } from '@/achare/hooks/useAchareRole';
import { AchareRoleSwitcherBar } from '@/achare/components/AchareRoleSwitcherBar';
import { KPIWidget } from '@/achare/widgets/KPIWidget';
import { RecruitmentPipelineWidget } from '@/achare/widgets/RecruitmentPipelineWidget';
import { SalesPipelineWidget } from '@/achare/widgets/SalesPipelineWidget';
import { AttendanceTodayWidget } from '@/achare/widgets/AttendanceTodayWidget';
import { PayrollSummaryWidget } from '@/achare/widgets/PayrollSummaryWidget';
import { UpcomingInterviewsWidget } from '@/achare/widgets/UpcomingInterviewsWidget';
import { OpenJobsWidget } from '@/achare/widgets/OpenJobsWidget';
import { QuickActionsWidget } from '@/achare/widgets/QuickActionsWidget';

const StyledDashboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[4]} 0;
  width: 100%;
  box-sizing: border-box;
`;

const StyledKPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledTwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${themeCssVariables.spacing[4]};

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const DashboardPage = () => {
  const { role } = useAchareRole();

  return (
    <PageContainer>
      <Section>
        <StyledDashboard>
          {/* Persona Switcher */}
          <AchareRoleSwitcherBar />

          {/* ADMIN / FOUNDER VIEW */}
          {role === 'admin' && (
            <>
              <StyledKPIGrid>
                <KPIWidget
                  title="Revenue Pipeline"
                  value="$309,500"
                  Icon={IconTargetArrow}
                  delta="+18.4%"
                  subtext="vs last month"
                  isPositive
                />
                <KPIWidget
                  title="Active Openings"
                  value="14 Jobs"
                  Icon={IconBriefcase}
                  delta="4 High Priority"
                  isPositive
                />
                <KPIWidget
                  title="Headcount"
                  value="48 Members"
                  Icon={IconUsers}
                  delta="+3 this month"
                  isPositive
                />
                <KPIWidget
                  title="Attendance Today"
                  value="92%"
                  Icon={IconClock}
                  delta="42 Clocked In"
                  isPositive
                />
              </StyledKPIGrid>

              <StyledTwoColumnGrid>
                <RecruitmentPipelineWidget />
                <SalesPipelineWidget />
              </StyledTwoColumnGrid>

              <StyledTwoColumnGrid>
                <AttendanceTodayWidget />
                <PayrollSummaryWidget />
              </StyledTwoColumnGrid>

              <StyledTwoColumnGrid>
                <OpenJobsWidget />
                <UpcomingInterviewsWidget />
              </StyledTwoColumnGrid>

              <QuickActionsWidget role="admin" />
            </>
          )}

          {/* RECRUITER VIEW */}
          {role === 'recruiter' && (
            <>
              <StyledKPIGrid>
                <KPIWidget
                  title="Active Openings"
                  value="14 Jobs"
                  Icon={IconBriefcase}
                  delta="4 new this week"
                  isPositive
                />
                <KPIWidget
                  title="Candidates in Pipeline"
                  value="67 Candidates"
                  Icon={IconUsers}
                  delta="+12 sourced today"
                  isPositive
                />
                <KPIWidget
                  title="Interviews This Week"
                  value="11 Scheduled"
                  Icon={IconCalendarEvent}
                  delta="3 today"
                  isPositive
                />
                <KPIWidget
                  title="Offers Extended"
                  value="4 Offers"
                  Icon={IconCoins}
                  delta="2 Accepted"
                  isPositive
                />
              </StyledKPIGrid>

              <RecruitmentPipelineWidget />

              <StyledTwoColumnGrid>
                <OpenJobsWidget />
                <UpcomingInterviewsWidget />
              </StyledTwoColumnGrid>

              <QuickActionsWidget role="recruiter" />
            </>
          )}

          {/* BDE / SALES VIEW */}
          {role === 'bde' && (
            <>
              <StyledKPIGrid>
                <KPIWidget
                  title="Total Pipeline ARR"
                  value="$410,000"
                  Icon={IconTargetArrow}
                  delta="+24% target pacing"
                  isPositive
                />
                <KPIWidget
                  title="Closed Won (Q3)"
                  value="$128,500"
                  Icon={IconCoins}
                  delta="19 Accounts"
                  isPositive
                />
                <KPIWidget
                  title="Win Rate"
                  value="68%"
                  Icon={IconTrendingUp}
                  delta="+5% vs avg"
                  isPositive
                />
                <KPIWidget
                  title="Open Deals"
                  value="25 Deals"
                  Icon={IconCheckbox}
                  delta="8 Discovery"
                  isPositive
                />
              </StyledKPIGrid>

              <SalesPipelineWidget />
              <QuickActionsWidget role="bde" />
            </>
          )}

          {/* PEOPLE & HR VIEW */}
          {role === 'hr' && (
            <>
              <StyledKPIGrid>
                <KPIWidget
                  title="Total Headcount"
                  value="48 Staff"
                  Icon={IconUsers}
                  delta="5 Departments"
                  isPositive
                />
                <KPIWidget
                  title="Today's Attendance"
                  value="42 Present"
                  Icon={IconClock}
                  delta="3 Late"
                  isPositive={false}
                />
                <KPIWidget
                  title="Pending Leaves"
                  value="3 Requests"
                  Icon={IconCalendarEvent}
                  delta="Requires review"
                  isPositive={false}
                />
                <KPIWidget
                  title="August Payroll"
                  value="$148,650"
                  Icon={IconCoins}
                  delta="Processed & Paid"
                  isPositive
                />
              </StyledKPIGrid>

              <StyledTwoColumnGrid>
                <AttendanceTodayWidget />
                <PayrollSummaryWidget />
              </StyledTwoColumnGrid>

              <QuickActionsWidget role="hr" />
            </>
          )}

          {/* EMPLOYEE SELF-SERVICE VIEW */}
          {role === 'employee' && (
            <>
              <AttendanceTodayWidget />
              <StyledTwoColumnGrid>
                <PayrollSummaryWidget
                  periodName="August 2026 Payslip"
                  totalNet="$4,850.00"
                  employeeCount={1}
                  status="PAID"
                  payDate="Aug 31, 2026"
                />
                <QuickActionsWidget role="employee" />
              </StyledTwoColumnGrid>
            </>
          )}
        </StyledDashboard>
      </Section>
    </PageContainer>
  );
};
