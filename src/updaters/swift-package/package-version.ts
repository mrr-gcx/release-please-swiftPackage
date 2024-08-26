// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {logger as defaultLogger, Logger} from '../../util/logger';
import {DefaultUpdater} from '../default';

/**
 * Updates a Package.swift file with a version var like 'let version = 1.0.0'.
 */
export class PackageVersion extends DefaultUpdater {
  /**
   * Given initial file contents, return updated contents.
   * @param {string} content The initial content
   * @returns {string} The updated content
   */

  updateContent(content: string, logger: Logger = defaultLogger): string {
    const oldVersion = content.match(/^let version = "([0-9.]+)[\+|"]?(.*$)/m);
    let buildNumber = '';
    logger.debug('update content in PackageVersion');
    logger.debug(content);
    if (oldVersion) {
      buildNumber = oldVersion[2];
      const parsedBuild = parseInt(buildNumber);
      if (!isNaN(parsedBuild)) {
        buildNumber = `+${parsedBuild + 1}`;
        logger.debug(
          `updating from ${oldVersion[1]}+${oldVersion[2]} to ${this.version}${buildNumber}`
        );
      } else if (buildNumber.length > 0) {
        buildNumber = `+${buildNumber}`;
        logger.debug(
          `updating from ${oldVersion[1]}+${oldVersion[2]} to ${this.version}${buildNumber}`
        );
      } else {
        logger.debug(`updating from ${oldVersion[1]} to ${this.version}`);
      }
    }
    return content.replace(
      /^let version = .*$/m,
      `let version = "${this.version}${buildNumber}"`
    );
  }
}
