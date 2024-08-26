// Copyright 2020 Google LLC
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

// Generic
import {Changelog} from '../updaters/changelog';
// Package.swift support
import {BaseStrategy, BuildUpdatesOptions, BaseStrategyOptions} from './base';
import {Update} from '../update';
import {PackageVersion} from '../updaters/swift-package/package-version';
import {MissingRequiredFileError} from '../errors';

export class SwiftPackage extends BaseStrategy {
    private packageFile: string = 'Package.swift';

    readonly versionFile: string;
    constructor(options: BaseStrategyOptions) {
    super(options);
    
    const fs = require('fs');
    try {
        fs.accessSync(this.packageFile);
        this.versionFile = this.packageFile;
    } catch (err) {
        throw new MissingRequiredFileError(
            this.addPath(this.packageFile),
            'swift-package',
            `${this.repository.owner}/${this.repository.repo}`
          );
    }
  }

  protected async buildUpdates(
    options: BuildUpdatesOptions
  ): Promise<Update[]> {
    const updates: Update[] = [];
    const version = options.newVersion;

    updates.push({
      path: this.addPath(this.changelogPath),
      createIfMissing: true,
      updater: new Changelog({
        version,
        changelogEntry: options.changelogEntry,
      }),
    });

    updates.push({
      path: this.addPath(this.versionFile),
      createIfMissing: false,
      updater: new PackageVersion({
        version,
      }),
    });

    return updates;
  }
}
