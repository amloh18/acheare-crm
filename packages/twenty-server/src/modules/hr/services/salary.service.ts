import { Injectable, Logger } from '@nestjs/common';

import { WorkspaceOrmManager } from 'src/engine/twenty-orm/workspace-orm.manager';
import { buildSystemAuthContext } from 'src/engine/twenty-orm/utils/build-system-auth-context.util';
import { SalaryStructureWorkspaceEntity } from 'src/modules/hr/standard-objects/salaryStructure.workspace-entity';
import { SalaryComponentWorkspaceEntity } from 'src/modules/hr/standard-objects/salaryComponent.workspace-entity';

export enum ComponentType {
  EARNING = 'EARNING',
  DEDUCTION = 'DEDUCTION',
}

export enum CalculationType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

@Injectable()
export class SalaryService {
  private readonly logger = new Logger(SalaryService.name);

  constructor(
    private readonly workspaceOrmManager: WorkspaceOrmManager,
  ) {}

  async createSalaryStructure(
    employeeId: string,
    effectiveFrom: Date,
    currency: string,
    monthlyGross: number,
    components: Array<{
      name: string;
      componentType: ComponentType;
      calculationType: CalculationType;
      amount?: number;
      percentage?: number;
    }>,
    workspaceId: string,
  ): Promise<SalaryStructureWorkspaceEntity> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const structureRepository =
          this.workspaceOrmManager.getRepository<SalaryStructureWorkspaceEntity>(
            'salaryStructure',
            { shouldBypassPermissionChecks: true },
          );

        const componentRepository =
          this.workspaceOrmManager.getRepository<SalaryComponentWorkspaceEntity>(
            'salaryComponent',
            { shouldBypassPermissionChecks: true },
          );

        const existingActive = await structureRepository.findOne({
          where: { employeeId, isActive: true },
        });

        if (existingActive) {
          await structureRepository.save({
            ...existingActive,
            isActive: false,
            effectiveTo: effectiveFrom,
          } as Partial<SalaryStructureWorkspaceEntity>);
        }

        const structure = (await structureRepository.save({
          employeeId,
          effectiveFrom,
          currency,
          monthlyGross,
          isActive: true,
        } as unknown as Partial<SalaryStructureWorkspaceEntity>)) as unknown as SalaryStructureWorkspaceEntity;

        for (let i = 0; i < components.length; i++) {
          const comp = components[i];
          await componentRepository.save({
            salaryStructureId: structure.id,
            name: comp.name,
            componentType: comp.componentType,
            calculationType: comp.calculationType,
            amount: comp.amount || 0,
            percentage: comp.percentage || 0,
            position: i,
          } as unknown as Partial<SalaryComponentWorkspaceEntity>);
        }

        return structure;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getActiveSalaryStructure(
    employeeId: string,
    workspaceId: string,
  ): Promise<SalaryStructureWorkspaceEntity | null> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const structureRepository =
          this.workspaceOrmManager.getRepository<SalaryStructureWorkspaceEntity>(
            'salaryStructure',
          );

        return structureRepository.findOne({
          where: { employeeId, isActive: true },
        });
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async getSalaryStructureAtDate(
    employeeId: string,
    date: Date,
    workspaceId: string,
  ): Promise<SalaryStructureWorkspaceEntity | null> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const structureRepository =
          this.workspaceOrmManager.getRepository<SalaryStructureWorkspaceEntity>(
            'salaryStructure',
          );

        const structures = await structureRepository.find({
          where: { employeeId },
          order: { effectiveFrom: 'DESC' },
        });

        for (const structure of structures) {
          const effectiveFrom = new Date(structure.effectiveFrom as unknown as string);
          if (effectiveFrom <= date) {
            if (!structure.effectiveTo || new Date(structure.effectiveTo as unknown as string) >= date) {
              return structure;
            }
          }
        }

        return null;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async calculateGrossEarnings(
    structureId: string,
    workspaceId: string,
  ): Promise<number> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const componentRepository =
          this.workspaceOrmManager.getRepository<SalaryComponentWorkspaceEntity>(
            'salaryComponent',
          );

        const structureRepository =
          this.workspaceOrmManager.getRepository<SalaryStructureWorkspaceEntity>(
            'salaryStructure',
          );

        const structure = await structureRepository.findOne({
          where: { id: structureId },
        });

        if (!structure) {
          throw new Error(`Salary structure ${structureId} not found`);
        }

        const components = await componentRepository.find({
          where: { salaryStructureId: structureId },
        });

        let total = 0;
        for (const comp of components) {
          if (comp.componentType === ComponentType.EARNING) {
            if (comp.calculationType === CalculationType.FIXED) {
              total += (comp.amount as unknown as number) || 0;
            } else if (comp.calculationType === CalculationType.PERCENTAGE) {
              total += (((structure.monthlyGross as unknown as number) || 0) * (comp.percentage || 0)) / 100;
            }
          }
        }

        return total;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async calculateTotalDeductions(
    structureId: string,
    workspaceId: string,
  ): Promise<number> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const componentRepository =
          this.workspaceOrmManager.getRepository<SalaryComponentWorkspaceEntity>(
            'salaryComponent',
          );

        const structureRepository =
          this.workspaceOrmManager.getRepository<SalaryStructureWorkspaceEntity>(
            'salaryStructure',
          );

        const structure = await structureRepository.findOne({
          where: { id: structureId },
        });

        if (!structure) {
          throw new Error(`Salary structure ${structureId} not found`);
        }

        const components = await componentRepository.find({
          where: { salaryStructureId: structureId },
        });

        let total = 0;
        for (const comp of components) {
          if (comp.componentType === ComponentType.DEDUCTION) {
            if (comp.calculationType === CalculationType.FIXED) {
              total += (comp.amount as unknown as number) || 0;
            } else if (comp.calculationType === CalculationType.PERCENTAGE) {
              total += (((structure.monthlyGross as unknown as number) || 0) * (comp.percentage || 0)) / 100;
            }
          }
        }

        return total;
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  async prorateSalary(
    employeeId: string,
    joinDate: Date,
    exitDate: Date | null,
    periodStartDate: Date,
    periodEndDate: Date,
    workspaceId: string,
  ): Promise<{ prorationFactor: number; workingDays: number; totalDays: number }> {
    return this.workspaceOrmManager.executeInWorkspaceContext(
      async () => {
        const totalDays = this.daysBetween(periodStartDate, periodEndDate);

        const effectiveStart = new Date(
          Math.max(joinDate.getTime(), periodStartDate.getTime()),
        );
        const effectiveEnd = exitDate
          ? new Date(Math.min(exitDate.getTime(), periodEndDate.getTime()))
          : periodEndDate;

        const workingDays = this.daysBetween(effectiveStart, effectiveEnd);

        const prorationFactor = totalDays > 0 ? workingDays / totalDays : 0;

        return { prorationFactor, workingDays, totalDays };
      },
      buildSystemAuthContext(workspaceId),
    );
  }

  private daysBetween(start: Date, end: Date): number {
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }
}
