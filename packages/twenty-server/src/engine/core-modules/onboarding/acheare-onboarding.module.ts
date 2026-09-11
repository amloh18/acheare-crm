import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AchareOnboardingResolver } from 'src/engine/core-modules/onboarding/acheare-onboarding.resolver';
import { AchareDashboardProvisioningService } from 'src/engine/core-modules/onboarding/services/acheare-dashboard-provisioning.service';
import { AchareOnboardingService } from 'src/engine/core-modules/onboarding/services/acheare-onboarding.service';
import { PermissionsModule } from 'src/engine/metadata-modules/permissions/permissions.module';
import { UserVarsModule } from 'src/engine/core-modules/user/user-vars/user-vars.module';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';

@Module({
  imports: [
    UserVarsModule,
    PermissionsModule,
    TypeOrmModule.forFeature([WorkspaceEntity]),
  ],
  exports: [AchareOnboardingService, AchareDashboardProvisioningService],
  providers: [
    AchareOnboardingService,
    AchareOnboardingResolver,
    AchareDashboardProvisioningService,
  ],
})
export class AchareOnboardingModule {}
