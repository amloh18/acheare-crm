import { Module } from '@nestjs/common';

import { EmployeeLifecycleService } from 'src/modules/hr/services/employee-lifecycle.service';
import { AttendanceService } from 'src/modules/hr/services/attendance.service';
import { LeaveService } from 'src/modules/hr/services/leave.service';
import { SalaryService } from 'src/modules/hr/services/salary.service';
import { PayrollCalculationService } from 'src/modules/hr/services/payroll-calculation.service';
import { PayrollLifecycleService } from 'src/modules/hr/services/payroll-lifecycle.service';
import { RosterService } from 'src/modules/hr/services/roster.service';
import { MyWorkspaceService } from 'src/modules/hr/services/my-workspace.service';

@Module({
  providers: [
    EmployeeLifecycleService,
    AttendanceService,
    LeaveService,
    SalaryService,
    PayrollCalculationService,
    PayrollLifecycleService,
    RosterService,
    MyWorkspaceService,
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
  ],
})
export class HrModule {}
