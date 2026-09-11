import { type CurrencyMetadata } from 'twenty-shared/types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type SalaryStructureWorkspaceEntity } from 'src/modules/hr/standard-objects/salaryStructure.workspace-entity';

export class SalaryComponentWorkspaceEntity extends BaseWorkspaceEntity {
  name: string | null;
  componentType: string | null;
  calculationType: string | null;
  amount: CurrencyMetadata | null;
  percentage: number | null;
  position: number;

  salaryStructure: EntityRelation<SalaryStructureWorkspaceEntity>;
  salaryStructureId: string | null;
}
