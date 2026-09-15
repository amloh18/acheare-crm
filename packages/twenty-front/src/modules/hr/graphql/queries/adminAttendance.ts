import { gql } from '@apollo/client';

export const GET_ALL_EMPLOYEES_ATTENDANCE = gql`
  query GetAllEmployeesAttendance($input: AllEmployeesAttendanceInput!) {
    allEmployeesAttendance(input: $input) {
      presentToday
      lateEntry
      onLeave
      absent
      totalEmployees
      employees {
        employeeId
        name
        role
        initials
        departmentId
        departmentName
        days {
          day
          status
          hours
          workedMinutes
          lateMinutes
        }
      }
    }
  }
`;

export const GET_ALL_LEAVE_REQUESTS = gql`
  query GetAllLeaveRequests($input: AllLeaveRequestsInput) {
    allLeaveRequests(input: $input) {
      requests {
        id
        employeeId
        employeeName
        leaveTypeId
        leaveTypeName
        startDate
        endDate
        days
        reason
        status
        reviewedAt
        reviewNotes
      }
      totalCount
      pendingCount
      approvedCount
      rejectedCount
    }
  }
`;

export const GET_LEAVE_TYPES = gql`
  query GetLeaveTypes {
    leaveTypes {
      id
      name
      isPaid
      annualQuota
      isActive
    }
  }
`;

export const GET_EMPLOYEE_LEAVE_BALANCE = gql`
  query GetEmployeeLeaveBalance($employeeId: String!, $year: Number!) {
    employeeLeaveBalance(employeeId: $employeeId, year: $year) {
      id
      leaveTypeId
      year
      entitled
      used
      pending
    }
  }
`;

export const APPROVE_LEAVE_REQUEST = gql`
  mutation ApproveLeaveRequest($leaveRequestId: String!) {
    approveLeaveRequest(leaveRequestId: $leaveRequestId)
  }
`;

export const REJECT_LEAVE_REQUEST = gql`
  mutation RejectLeaveRequest($leaveRequestId: String!, $reviewNotes: String) {
    rejectLeaveRequest(leaveRequestId: $leaveRequestId, reviewNotes: $reviewNotes)
  }
`;
