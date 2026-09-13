import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import {
  type ReadinessProbe,
  type ReadinessProbeOutcome,
} from 'src/engine/core-modules/health/types/readiness-check.type';
import { describeError } from 'src/engine/core-modules/health/utils/describe-error.util';

// Deliberately not DatabaseHealthIndicator: that one collects nine catalog
// queries for the admin dashboard. Readiness only needs to know whether the
// instance can serve requests, so it does three cheap queries.
@Injectable()
export class DatabaseReadinessProbe implements ReadinessProbe {
  readonly name = 'database';
  readonly fatal = true;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async check(): Promise<ReadinessProbeOutcome> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      return {
        status: 'down',
        message: `database unreachable: ${describeError(error)}`,
      };
    }

    try {
      const [{ exists }] = await this.dataSource.query(
        `SELECT EXISTS (
           SELECT 1 FROM information_schema.schemata WHERE schema_name = 'core'
         ) AS exists`,
      );

      if (!exists) {
        return {
          status: 'down',
          message: 'core schema is missing: migrations have not run yet',
        };
      }

      const [{ count }] = await this.dataSource.query(
        'SELECT count(*)::int AS count FROM core."_typeorm_migrations"',
      );

      if (count <= 0) {
        return {
          status: 'down',
          message: 'no instance migrations have been applied',
        };
      }

      return { status: 'up', message: `${count} migrations applied` };
    } catch (error) {
      return {
        status: 'down',
        message: `schema check failed: ${describeError(error)}`,
      };
    }
  }
}
