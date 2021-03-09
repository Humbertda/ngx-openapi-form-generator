/**
 * @license
 * Licensed under the MIT License, (“the License”); you may not use this
 * file except in compliance with the License.
 *
 * Copyright (c) 2021 humbertda
 */

import {RequiredOptions} from 'prettier';

export interface OutputFormatterOptions {
    filePrefix: string;
    fileSuffix: string;
    outputFolder: string;
    templatePropertyInterfaceName: string;
    tslintOptions: Partial<RequiredOptions>;
}
