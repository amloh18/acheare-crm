import { useQuery, useMutation } from '@apollo/client/react';

import {
  GET_ALL_EMPLOYEES_ATTENDANCE,
  GET_ALL_LEAVE_REQUESTS,
  GET_LEAVE_TYPES,
  GET_EMPLOYEE_LEAVE_BALANCE,
  APPROVE_LEAVE_REQUEST,
  REJECT_LEAVE_REQUEST,
} from '@/hr/graphql/queries/adminAttendance';

export const useAllEmployeesAttendance = (input: {
  startDate: string;
  endDate: string;
  departmentId?: string;
  status?: string;
}) => {
  return useQuery(GET_ALL_EMPLOYEES_ATTENDANCE, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
  });
};

export const useAllLeaveRequests = (input?: {
  status?: string;
  employeeId?: string;
  leaveTypeId?: string;
}) => {
  return useQuery(GET_ALL_LEAVE_REQUESTS, {
    variables: { input },
    fetchPolicy: 'cache-and-network',
  });
};

export const useLeaveTypes = () => {
  return useQuery(GET_LEAVE_TYPES, {
    fetchPolicy: 'cache-first',
  });
};

export const useEmployeeLeaveBalance = (employeeId: string, year: number) => {
  return useQuery(GET_EMPLOYEE_LEAVE_BALANCE, {
    variables: { employeeId, year },
    fetchPolicy: 'cache-and-network',
    skip: !employeeId,
  });
};

export const useApproveLeaveRequest = () => {
  return useMutation(APPROVE_LEAVE_REQUEST, {
    refetchQueries: ['GetAllLeaveRequests'],
  });
};

export const useRejectLeaveRequest = () => {
  return useMutation(REJECT_LEAVE_REQUEST, {
    refetchQueries: ['GetAllLeaveRequests'],
  });
};
