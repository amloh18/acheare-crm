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
      stats {
        pendingTasks
        unreadNotifications
        upcomingLeave
      }
    }
  }
`;
