import { Module } from '@nestjs/common';

import { CalendarModule } from 'src/modules/calendar/calendar.module';
import { ConnectedAccountModule } from 'src/modules/connected-account/connected-account.module';
import { FinanceModule } from 'src/modules/finance/finance.module';
import { HrModule } from 'src/modules/hr/hr.module';
import { MessagingModule } from 'src/modules/messaging/messaging.module';
import { OnboardingInviteSuggestionsModule } from 'src/modules/onboarding-invite-suggestions/onboarding-invite-suggestions.module';
import { RecruitmentModule } from 'src/modules/recruitment/recruitment.module';
import { WorkflowModule } from 'src/modules/workflow/workflow.module';
import { WorkspaceMemberModule } from 'src/modules/workspace-member/workspace-member.module';

@Module({
  imports: [
    MessagingModule,
    CalendarModule,
    ConnectedAccountModule,
    OnboardingInviteSuggestionsModule,
    WorkflowModule,
    WorkspaceMemberModule,
    HrModule,
    RecruitmentModule,
    FinanceModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}
