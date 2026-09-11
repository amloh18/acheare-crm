import { Module } from '@nestjs/common';

import { CandidateConversionService } from 'src/modules/recruitment/services/candidate-conversion.service';

@Module({
  providers: [CandidateConversionService],
  exports: [CandidateConversionService],
})
export class RecruitmentModule {}
