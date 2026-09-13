import { Test } from '@nestjs/testing';
import type { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
  AchareSetupStepKeys,
  ACHARE_SETUP_CURRENT_VERSION,
} from 'src/engine/core-modules/onboarding/constants/acheare-setup-step-keys';
import { AchareOnboardingService } from 'src/engine/core-modules/onboarding/services/acheare-onboarding.service';
import { OnboardingStatus } from 'src/engine/core-modules/onboarding/enums/onboarding-status.enum';
import { UserVarsService } from 'src/engine/core-modules/user/user-vars/services/user-vars.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { WorkspaceFeatureService } from 'src/engine/core-modules/workspace-feature/services/workspace-feature.service';

describe('AchareOnboardingService', () => {
  let service: AchareOnboardingService;
  let userVarsService: jest.Mocked<UserVarsService<any>>;
  let workspaceRepository: jest.Mocked<Repository<WorkspaceEntity>>;
  let workspaceFeatureService: jest.Mocked<WorkspaceFeatureService>;

  const mockUserId = 'test-user-id';
  const mockWorkspaceId = 'test-workspace-id';

  beforeEach(async () => {
    const mockUserVarsService = {
      get: jest.fn(),
      getAll: jest.fn(),
      set: jest.fn(),
      setIfNotExists: jest.fn(),
      delete: jest.fn(),
    };

    const mockWorkspaceRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const mockWorkspaceFeatureService = {
      getOnboardingSteps: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchareOnboardingService,
        {
          provide: UserVarsService,
          useValue: mockUserVarsService,
        },
        {
          provide: WorkspaceFeatureService,
          useValue: mockWorkspaceFeatureService,
        },
        {
          provide: getRepositoryToken(WorkspaceEntity),
          useValue: mockWorkspaceRepository,
        },
      ],
    }).compile();

    service = module.get<AchareOnboardingService>(AchareOnboardingService);
    userVarsService = module.get(UserVarsService);
    workspaceRepository = module.get(getRepositoryToken(WorkspaceEntity));
    workspaceFeatureService = module.get(WorkspaceFeatureService);

    // Default: a workspace with every module, i.e. the full wizard.
    workspaceFeatureService.getOnboardingSteps.mockResolvedValue([
      'WELCOME',
      'BASIC_SETUP',
      'SETUP_CHOICE',
      'FEATURE_SELECTION',
      'AGENCY',
      'TEAM',
      'CRM_IMPORT',
      'RECRUITMENT',
      'HR',
      'PAYROLL',
      'FINANCE',
      'DOCUMENTS',
      'DASHBOARD',
      'REVIEW',
    ]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isAchareOnboardingActive', () => {
    it('should return true when setup status is IN_PROGRESS', async () => {
      userVarsService.get.mockResolvedValue('IN_PROGRESS');

      const result = await service.isAchareOnboardingActive({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(result).toBe(true);
    });

    it('should return false when setup status is NOT_STARTED', async () => {
      userVarsService.get.mockResolvedValue('NOT_STARTED');

      const result = await service.isAchareOnboardingActive({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(result).toBe(false);
    });

    it('should return false when setup status is COMPLETED', async () => {
      userVarsService.get.mockResolvedValue('COMPLETED');

      const result = await service.isAchareOnboardingActive({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(result).toBe(false);
    });
  });

  describe('getSetupStatus', () => {
    it('should return ACHARE_WELCOME when no current step', async () => {
      userVarsService.get.mockResolvedValue(null);

      const result = await service.getSetupStatus({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(result).toBe(OnboardingStatus.ACHARE_WELCOME);
    });

    it('should return correct status for each step', async () => {
      const stepToStatusMap = {
        WELCOME: OnboardingStatus.ACHARE_WELCOME,
        BASIC_SETUP: OnboardingStatus.ACHARE_BASIC_SETUP,
        SETUP_CHOICE: OnboardingStatus.ACHARE_SETUP_CHOICE,
        FEATURE_SELECTION: OnboardingStatus.ACHARE_FEATURE_SELECTION,
        AGENCY: OnboardingStatus.ACHARE_AGENCY,
        TEAM: OnboardingStatus.ACHARE_TEAM,
        CRM_IMPORT: OnboardingStatus.ACHARE_CRM_IMPORT,
        RECRUITMENT: OnboardingStatus.ACHARE_RECRUITMENT,
        HR: OnboardingStatus.ACHARE_HR,
        PAYROLL: OnboardingStatus.ACHARE_PAYROLL,
        FINANCE: OnboardingStatus.ACHARE_FINANCE,
        DOCUMENTS: OnboardingStatus.ACHARE_DOCUMENTS,
        DASHBOARD: OnboardingStatus.ACHARE_DASHBOARD,
        REVIEW: OnboardingStatus.ACHARE_REVIEW,
      };

      for (const [step, expectedStatus] of Object.entries(stepToStatusMap)) {
        userVarsService.get.mockResolvedValue(step);

        const result = await service.getSetupStatus({
          userId: mockUserId,
          workspaceId: mockWorkspaceId,
        });

        expect(result).toBe(expectedStatus);
      }
    });
  });

  describe('getStepOrder', () => {
    it('should delegate to the workspace feature configuration', async () => {
      const stepOrder = await service.getStepOrder(mockWorkspaceId);

      expect(workspaceFeatureService.getOnboardingSteps).toHaveBeenCalledWith(
        mockWorkspaceId,
      );
      expect(stepOrder).toContain('FEATURE_SELECTION');
    });
  });

  describe('getNextStep', () => {
    const mockProgress = (overrides: Record<string, unknown>) => {
      userVarsService.getAll.mockResolvedValue(
        new Map<string, any>([
          [AchareSetupStepKeys.ACHARE_SETUP_STATUS, 'IN_PROGRESS'],
          ...Object.entries(overrides),
        ]),
      );
    };

    it('should return the next step in the generated order', async () => {
      mockProgress({
        [AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP]: 'FEATURE_SELECTION',
      });

      const nextStep = await service.getNextStep({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(nextStep).toBe('AGENCY');
    });

    it('should skip a module step the workspace does not have', async () => {
      workspaceFeatureService.getOnboardingSteps.mockResolvedValue([
        'WELCOME',
        'BASIC_SETUP',
        'SETUP_CHOICE',
        'FEATURE_SELECTION',
        'AGENCY',
        'TEAM',
        'REVIEW',
      ]);
      mockProgress({
        [AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP]: 'TEAM',
      });

      const nextStep = await service.getNextStep({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(nextStep).toBe('REVIEW');
    });

    it('should return null when the wizard is completed', async () => {
      userVarsService.getAll.mockResolvedValue(
        new Map<string, any>([
          [AchareSetupStepKeys.ACHARE_SETUP_STATUS, 'COMPLETED'],
        ]),
      );

      const nextStep = await service.getNextStep({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(nextStep).toBeNull();
    });

    it('should jump to REVIEW for module steps in MANUAL mode', async () => {
      mockProgress({
        [AchareSetupStepKeys.ACHARE_SETUP_MODE]: 'MANUAL',
        [AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP]: 'AGENCY',
      });

      const nextStep = await service.getNextStep({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(nextStep).toBe('REVIEW');
    });
  });

  describe('startOnboarding', () => {
    it('should set status to IN_PROGRESS and current step to WELCOME', async () => {
      userVarsService.get.mockResolvedValue(null);
      userVarsService.set.mockResolvedValue(undefined);

      await service.startOnboarding({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(userVarsService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: AchareSetupStepKeys.ACHARE_SETUP_STATUS,
          value: 'IN_PROGRESS',
        }),
      );

      expect(userVarsService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP,
          value: 'WELCOME',
        }),
      );
    });

    it('should not restart if already completed', async () => {
      userVarsService.get.mockResolvedValue('COMPLETED');

      await service.startOnboarding({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(userVarsService.set).not.toHaveBeenCalled();
    });
  });

  describe('completeStep', () => {
    it('should set completion flag for the step', async () => {
      userVarsService.set.mockResolvedValue(undefined);

      await service.completeStep({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
        step: 'BASIC_SETUP',
      });

      expect(userVarsService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: AchareSetupStepKeys.ACHARE_BASIC_SETUP_COMPLETED,
          value: true,
        }),
      );
    });

    it('should not set completion flag for WELCOME step', async () => {
      userVarsService.set.mockResolvedValue(undefined);

      await service.completeStep({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
        step: 'WELCOME',
      });

      expect(userVarsService.set).not.toHaveBeenCalled();
    });
  });

  describe('skipStep', () => {
    it('should set skip flag and completion flag for HR', async () => {
      userVarsService.set.mockResolvedValue(undefined);

      await service.skipStep({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
        step: 'HR',
      });

      expect(userVarsService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: AchareSetupStepKeys.ACHARE_HR_SKIPPED,
          value: true,
        }),
      );

      expect(userVarsService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: AchareSetupStepKeys.ACHARE_HR_COMPLETED,
          value: true,
        }),
      );
    });

    it('should set skip flag and completion flag for PAYROLL', async () => {
      userVarsService.set.mockResolvedValue(undefined);

      await service.skipStep({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
        step: 'PAYROLL',
      });

      expect(userVarsService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: AchareSetupStepKeys.ACHARE_PAYROLL_SKIPPED,
          value: true,
        }),
      );

      expect(userVarsService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: AchareSetupStepKeys.ACHARE_PAYROLL_COMPLETED,
          value: true,
        }),
      );
    });

    it('should reject a step that cannot be skipped', async () => {
      await expect(
        service.skipStep({
          userId: mockUserId,
          workspaceId: mockWorkspaceId,
          step: 'BASIC_SETUP',
        }),
      ).rejects.toThrow('Step BASIC_SETUP cannot be skipped');

      expect(userVarsService.set).not.toHaveBeenCalled();
    });
  });

  describe('finishOnboarding', () => {
    it('should set status to COMPLETED with timestamp and version', async () => {
      userVarsService.set.mockResolvedValue(undefined);

      await service.finishOnboarding({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(userVarsService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: AchareSetupStepKeys.ACHARE_SETUP_STATUS,
          value: 'COMPLETED',
        }),
      );

      expect(userVarsService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: AchareSetupStepKeys.ACHARE_SETUP_VERSION,
          value: ACHARE_SETUP_CURRENT_VERSION,
        }),
      );

      expect(userVarsService.set).toHaveBeenCalledWith(
        expect.objectContaining({
          key: AchareSetupStepKeys.ACHARE_SETUP_COMPLETED_AT,
        }),
      );
    });
  });

  describe('getSetupProgress', () => {
    it('should return correct progress with completed steps', async () => {
      userVarsService.getAll.mockResolvedValue(
        new Map<string, any>([
          [AchareSetupStepKeys.ACHARE_SETUP_STATUS, 'IN_PROGRESS'],
          [AchareSetupStepKeys.ACHARE_SETUP_MODE, 'GUIDED'],
          [AchareSetupStepKeys.ACHARE_SETUP_CURRENT_STEP, 'TEAM'],
          [AchareSetupStepKeys.ACHARE_BASIC_SETUP_COMPLETED, true],
          [AchareSetupStepKeys.ACHARE_AGENCY_COMPLETED, true],
        ]),
      );

      const progress = await service.getSetupProgress({
        userId: mockUserId,
        workspaceId: mockWorkspaceId,
      });

      expect(progress.status).toBe('IN_PROGRESS');
      expect(progress.mode).toBe('GUIDED');
      expect(progress.currentStep).toBe('TEAM');
      expect(progress.completedSteps).toContain('BASIC_SETUP');
      expect(progress.completedSteps).toContain('AGENCY');
      expect(progress.completedSteps).not.toContain('TEAM');
    });
  });
});
