import { Module } from '@nestjs/common';

import { CandidateConversionService } from 'src/modules/recruitment/services/candidate-conversion.service';
import { CandidateConversionResolver } from 'src/modules/recruitment/resolvers/candidate-conversion.resolver';

@Module({
  providers: [CandidateConversionService, CandidateConversionResolver],
  exports: [CandidateConversionService],
})
export class RecruitmentModule {}
