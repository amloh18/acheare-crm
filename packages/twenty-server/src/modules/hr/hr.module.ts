import { Module } from '@nestjs/common';

import { EmployeeLifecycleService } from 'src/modules/hr/services/employee-lifecycle.service';
import { AttendanceService } from 'src/modules/hr/services/attendance.service';
import { LeaveService } from 'src/modules/hr/services/leave.service';
import { SalaryService } from 'src/modules/hr/services/salary.service';
import { PayrollCalculationService } from 'src/modules/hr/services/payroll-calculation.service';
import { PayrollLifecycleService } from 'src/modules/hr/services/payroll-lifecycle.service';
import { RosterService } from 'src/modules/hr/services/roster.service';
import { MyWorkspaceService } from 'src/modules/hr/services/my-workspace.service';
import { AdminAttendanceService } from 'src/modules/hr/services/admin-attendance.service';
import { CompanySettingsService } from 'src/modules/hr/services/company-settings.service';
import { LocationService } from 'src/modules/hr/services/location.service';
import { AchareRoleGuard } from 'src/modules/hr/guards/achare-role.guard';
import { UserRoleModule } from 'src/engine/metadata-modules/user-role/user-role.module';
import { MyWorkspaceResolver } from 'src/modules/hr/resolvers/my-workspace.resolver';
import { AttendanceResolver } from 'src/modules/hr/resolvers/attendance.resolver';
import { LeaveResolver } from 'src/modules/hr/resolvers/leave.resolver';
import { PayrollResolver } from 'src/modules/hr/resolvers/payroll.resolver';
import { EmployeeLifecycleResolver } from 'src/modules/hr/resolvers/employee-lifecycle.resolver';
import { AnnouncementResolver } from 'src/modules/hr/resolvers/announcement.resolver';
import { AdminAttendanceResolver } from 'src/modules/hr/resolvers/admin-attendance.resolver';
import { CompanySettingsResolver } from 'src/modules/hr/resolvers/company-settings.resolver';
import { LocationResolver } from 'src/modules/hr/resolvers/location.resolver';

@Module({
  imports: [UserRoleModule],
  providers: [
    EmployeeLifecycleService,
    AttendanceService,
    LeaveService,
    SalaryService,
    PayrollCalculationService,
    PayrollLifecycleService,
    RosterService,
    MyWorkspaceService,
    AdminAttendanceService,
    CompanySettingsService,
    LocationService,
    AchareRoleGuard,
    MyWorkspaceResolver,
    AttendanceResolver,
    LeaveResolver,
    PayrollResolver,
    EmployeeLifecycleResolver,
    AnnouncementResolver,
    AdminAttendanceResolver,
    CompanySettingsResolver,
    LocationResolver,
  ],
  exports: [
    EmployeeLifecycleService,
    AttendanceService,
    LeaveService,
    SalaryService,
    PayrollCalculationService,
    PayrollLifecycleService,
    RosterService,
    MyWorkspaceService,
    AdminAttendanceService,
    CompanySettingsService,
    LocationService,
  ],
})
export class HrModule {}
