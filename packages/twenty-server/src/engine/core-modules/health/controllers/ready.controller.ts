import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';

import { type Response } from 'express';
import { ApiPath } from 'twenty-shared/types';

import { ReadinessService } from 'src/engine/core-modules/health/services/readiness.service';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';

// `/healthz` answers "is the process alive?" and nothing more. `/readyz`
// answers "can this instance serve requests?": database, migrations, redis and
// storage. Container healthchecks, load balancers and `achare doctor` all read
// the same body, so the shape is stable and machine-readable.
@Controller(ApiPath.Ready)
export class ReadyController {
  constructor(private readonly readinessService: ReadinessService) {}

  @Get()
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async check(@Res() response: Response): Promise<void> {
    const report = await this.readinessService.getReadinessReport();

    response
      .status(
        report.status === 'unavailable'
          ? HttpStatus.SERVICE_UNAVAILABLE
          : HttpStatus.OK,
      )
      .json(report);
  }
}
