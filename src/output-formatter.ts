/**
 * @license
 * Licensed under the MIT License, (“the License”); you may not use this
 * file except in compliance with the License.
 *
 * Copyright (c) 2021 humbertda
 */

import {GeneratorResult} from './models';

export interface OutputFormatter {
    handleOutput(content: GeneratorResult): Promise<void>;
}

