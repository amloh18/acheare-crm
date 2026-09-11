import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { WorkspaceEventEmitter } from 'src/engine/workspace-event-emitter/workspace-event-emitter';
import { CandidateWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate.workspace-entity';
import { CandidateSubmissionWorkspaceEntity } from 'src/modules/recruitment/standard-objects/candidate-submission.workspace-entity';
import { EmployeeWorkspaceEntity } from 'src/modules/hr/standard-objects/employee.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { OnboardingItemWorkspaceEntity } from 'src/modules/hr/standard-objects/onboardingItem.workspace-entity';

export interface ConversionResult {
  employee: EmployeeWorkspaceEntity;
  candidate: CandidateWorkspaceEntity;
  onboardingItems: OnboardingItemWorkspaceEntity[];
}

@Injectable()
export class CandidateConversionService {
  private readonly logger = new Logger(CandidateConversionService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
    private readonly workspaceEventEmitter: WorkspaceEventEmitter,
  ) {}

  async convertCandidateToEmployee(
    candidateId: string,
    submissionId: string,
    workspaceId: string,
    options?: {
      departmentId?: string;
      teamId?: string;
      designationId?: string;
      locationId?: string;
      managerId?: string;
      joiningDate?: Date;
      employeeCode?: string;
    },
  ): Promise<ConversionResult> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const candidateRepository =
          this.workspaceOrmManager.getRepository<CandidateWorkspaceEntity>(
            'candidate',
            { shouldBypassPermissionChecks: true },
          );

        const submissionRepository =
          this.workspaceOrmManager.getRepository<CandidateSubmissionWorkspaceEntity>(
            'candidateSubmission',
            { shouldBypassPermissionChecks: true },
          );

        const employeeRepository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
            { shouldBypassPermissionChecks: true },
          );

        const personRepository =
          this.workspaceOrmManager.getRepository<PersonWorkspaceEntity>(
            'person',
            { shouldBypassPermissionChecks: true },
          );

        const onboardingItemRepository =
          this.workspaceOrmManager.getRepository<OnboardingItemWorkspaceEntity>(
            'onboardingItem',
            { shouldBypassPermissionChecks: true },
          );

        const candidate = await candidateRepository.findOne({
          where: { id: candidateId },
        });

        if (!candidate) {
          throw new Error(`Candidate ${candidateId} not found`);
        }

        const submission = await submissionRepository.findOne({
          where: { id: submissionId },
        });

        if (!submission) {
          throw new Error(`Submission ${submissionId} not found`);
        }

        if (submission.candidateId !== candidateId) {
          throw new Error('Submission does not belong to this candidate');
        }

        let person: PersonWorkspaceEntity | null = null;
        if (candidate.personId) {
          person = await personRepository.findOne({
            where: { id: candidate.personId },
          });
        }

        const employee: EmployeeWorkspaceEntity = (await employeeRepository.save({
          personId: candidate.personId || null,
          employeeCode: options?.employeeCode || null,
          status: 'ACTIVE',
          employmentType: 'FULL_TIME',
          joiningDate:
            options?.joiningDate || submission.joiningDate || new Date(),
          departmentId: options?.departmentId || null,
          teamId: options?.teamId || null,
          designationId: options?.designationId || null,
          locationId: options?.locationId || null,
          managerId: options?.managerId || null,
          workLocation: null,
        } as Partial<EmployeeWorkspaceEntity>)) as unknown as EmployeeWorkspaceEntity;

        await submissionRepository.save({
          ...submission,
          stage: 'JOINED',
        } as Partial<CandidateSubmissionWorkspaceEntity>);

        await candidateRepository.save({
          ...candidate,
          status: 'JOINED',
        } as Partial<CandidateWorkspaceEntity>);

        const onboardingItems = await this.createOnboardingItems(
          employee.id,
          workspaceId,
        );

        this.workspaceEventEmitter.emitCustomBatchEvent(
          'recruitment_candidateConverted',
          [
            {
              candidateId,
              employeeId: employee.id,
              submissionId,
              workspaceId,
            },
          ],
          workspaceId,
        );

        return { employee, candidate, onboardingItems };
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  private async createOnboardingItems(
    employeeId: string,
    workspaceId: string,
  ): Promise<OnboardingItemWorkspaceEntity[]> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const onboardingItemRepository =
          this.workspaceOrmManager.getRepository<OnboardingItemWorkspaceEntity>(
            'onboardingItem',
            { shouldBypassPermissionChecks: true },
          );

        const defaultItems = [
          { title: 'Offer Letter', category: 'DOCUMENTS', isRequired: true },
          { title: 'Joining Form', category: 'DOCUMENTS', isRequired: true },
          { title: 'Identity Documents', category: 'DOCUMENTS', isRequired: true },
          { title: 'Bank Details', category: 'DOCUMENTS', isRequired: true },
          { title: 'Emergency Contact', category: 'DOCUMENTS', isRequired: false },
          { title: 'Policy Acknowledgement', category: 'DOCUMENTS', isRequired: false },
          { title: 'Asset Allocation', category: 'LOGISTICS', isRequired: false },
          { title: 'Department Assignment', category: 'SETUP', isRequired: true },
          { title: 'Manager Assignment', category: 'SETUP', isRequired: true },
          { title: 'System Access', category: 'SETUP', isRequired: true },
        ];

        const items: OnboardingItemWorkspaceEntity[] = [];

        for (const item of defaultItems) {
          const saved = (await onboardingItemRepository.save({
            employeeId,
            title: item.title,
            category: item.category,
            isRequired: item.isRequired,
            status: 'PENDING',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          } as Partial<OnboardingItemWorkspaceEntity>)) as unknown as OnboardingItemWorkspaceEntity;

          items.push(saved as OnboardingItemWorkspaceEntity);
        }

        return items;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getConversionHistory(
    workspaceId: string,
  ): Promise<Array<{
    candidateId: string;
    candidateName: string;
    employeeId: string;
    convertedAt: Date;
  }>> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const employeeRepository =
          this.workspaceOrmManager.getRepository<EmployeeWorkspaceEntity>(
            'employee',
          );

        const employees = await employeeRepository.find({
          where: {},
        });

        const history: Array<{
          candidateId: string;
          candidateName: string;
          employeeId: string;
          convertedAt: Date;
        }> = [];

        for (const emp of employees) {
          if (emp.personId) {
            history.push({
              candidateId: emp.personId,
              candidateName: emp.employeeCode || 'Unknown',
              employeeId: emp.id,
              convertedAt: new Date(emp.createdAt),
            });
          }
        }

        return history;
      },
      buildSystemAuthContext(workspaceId),
    );
  }
}
