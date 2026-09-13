import { Injectable } from '@nestjs/common';

import {
  READINESS_PROBE_TIMEOUT_MS,
  READINESS_STORAGE_PROBE_CONTENT,
  READINESS_STORAGE_PROBE_FILENAME,
  READINESS_STORAGE_PROBE_FOLDER,
} from 'src/engine/core-modules/health/constants/readiness-probe.constant';
import {
  type ReadinessProbe,
  type ReadinessProbeOutcome,
} from 'src/engine/core-modules/health/types/readiness-check.type';
import { describeError } from 'src/engine/core-modules/health/utils/describe-error.util';
import { FileStorageDriverFactory } from 'src/engine/core-modules/file-storage/file-storage-driver.factory';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { withDeadline } from 'src/utils/with-deadline';

// Existence of the storage volume is not the same thing as being able to write
// to it: a read-only mount, an expired S3 credential or a full disk all pass a
// stat() and fail a write. This goes through the configured driver, so LOCAL
// and S_3 are covered by the same probe.
@Injectable()
export class StorageReadinessProbe implements ReadinessProbe {
  readonly name = 'storage';
  readonly fatal = true;

  constructor(
    private readonly fileStorageDriverFactory: FileStorageDriverFactory,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  async check(): Promise<ReadinessProbeOutcome> {
    const filePath = `${READINESS_STORAGE_PROBE_FOLDER}/${READINESS_STORAGE_PROBE_FILENAME}`;
    const storageType = this.twentyConfigService.get('STORAGE_TYPE');

    try {
      const driver = this.fileStorageDriverFactory.getCurrentDriver();

      await withDeadline({
        promise: driver.writeFile({
          filePath,
          sourceFile: Buffer.from(READINESS_STORAGE_PROBE_CONTENT),
          mimeType: 'text/plain',
        }),
        timeoutMs: READINESS_PROBE_TIMEOUT_MS,
        createTimeoutError: () =>
          new Error('storage write timed out'),
      });

      const metadata = await withDeadline({
        promise: driver.getFileMetadata({ filePath }),
        timeoutMs: READINESS_PROBE_TIMEOUT_MS,
        createTimeoutError: () => new Error('storage read-back timed out'),
      });

      if (!metadata) {
        return {
          status: 'down',
          message: `${storageType} driver accepted a write but could not read it back`,
        };
      }

      return { status: 'up', message: `${storageType} driver writable` };
    } catch (error) {
      return {
        status: 'down',
        message: `${storageType} driver not writable: ${describeError(error)}`,
      };
    } finally {
      await this.deleteProbeObject();
    }
  }

  // Never let cleanup turn a healthy probe into a failed one: leaving the probe
  // object behind is harmless, but throwing here would mask the real result.
  private async deleteProbeObject(): Promise<void> {
    try {
      await this.fileStorageDriverFactory.getCurrentDriver().delete({
        folderPath: READINESS_STORAGE_PROBE_FOLDER,
        filename: READINESS_STORAGE_PROBE_FILENAME,
      });
    } catch {
      // ignored on purpose
    }
  }
}
