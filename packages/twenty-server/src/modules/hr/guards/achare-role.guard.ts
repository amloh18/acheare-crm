import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { isDefined } from 'twenty-shared/utils';

import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import { STANDARD_ROLE } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-role.constant';

export const ROLES_KEY = 'achareRoles';

// Map human-readable role labels to STANDARD_ROLE universal identifiers
const ROLE_LABEL_TO_UNIVERSAL_IDENTIFIER: Record<string, string> = {
  admin: STANDARD_ROLE.admin.universalIdentifier,
  hr: STANDARD_ROLE.hrManager.universalIdentifier,
  recruiter: STANDARD_ROLE.recruiter.universalIdentifier,
  finance: STANDARD_ROLE.finance.universalIdentifier,
};

@Injectable()
export class AchareRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userRoleService: UserRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isDefined(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const userWorkspaceId = request.userWorkspaceId as string | undefined;
    const workspaceId = request.workspace?.id as string | undefined;

    if (!isDefined(userWorkspaceId) || !isDefined(workspaceId)) {
      throw new UnauthorizedException('Missing authentication context');
    }

    const roleId = await this.userRoleService.getRoleIdForUserWorkspace({
      workspaceId,
      userWorkspaceId,
    });

    const roleUniversalIdentifiers = requiredRoles
      .map((label) => ROLE_LABEL_TO_UNIVERSAL_IDENTIFIER[label.toLowerCase()])
      .filter(isDefined);

    if (roleUniversalIdentifiers.includes(roleId)) {
      return true;
    }

    throw new UnauthorizedException(
      `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`,
    );
  }
}
