import { gql } from '@apollo/client';

export const GET_MY_WORKSPACE_DATA = gql`
  query GetMyWorkspaceData {
    myWorkspaceData {
      hasEmployeeRecord
      employeeId
      attendanceStatus
      firstCheckIn
      lastCheckOut
      workedMinutes
      pendingLeaveRequests
      leaveBalanceDays
      recentPayslipCount
      announcementCount
      pendingLeaveRequestList {
        id
        leaveTypeId
        startDate
        endDate
        days
        status
        reason
      }
      leaveBalanceList {
        id
        leaveTypeId
        year
        entitled
        used
        pending
        available
      }
      recentPayslipList {
        id
        payrollPeriodId
        netPayAmountMicros
        currencyCode
        paymentStatus
        paidAt
      }
      announcementList {
        id
        title
        body
        publishAt
      }
      stats {
        pendingTasks
        unreadNotifications
        upcomingLeave
      }
    }
  }
`;
