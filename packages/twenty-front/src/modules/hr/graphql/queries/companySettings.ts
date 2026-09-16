import { gql } from '@apollo/client';

export const GET_COMPANY_SETTINGS = gql`
  query GetCompanySettings {
    getCompanySettings {
      id
      companyName
      workStartTime
      workEndTime
      breakMinutes
      graceMinutes
      workingDays
      lateThresholdMinutes
      halfDayThresholdMinutes
      absentThresholdMinutes
      timingMode
      flexibleHoursRequired
      requireGeolocationForCheckIn
      allowRemoteCheckIn
      isActive
    }
  }
`;

export const UPSERT_COMPANY_SETTINGS = gql`
  mutation UpsertCompanySettings($input: UpsertCompanySettingsInput!) {
    upsertCompanySettings(input: $input) {
      id
      companyName
      workStartTime
      workEndTime
      breakMinutes
      graceMinutes
      workingDays
      lateThresholdMinutes
      halfDayThresholdMinutes
      absentThresholdMinutes
      timingMode
      flexibleHoursRequired
      requireGeolocationForCheckIn
      allowRemoteCheckIn
      isActive
    }
  }
`;
