/**
 * @license
 * Licensed under the MIT License, (“the License”); you may not use this
 * file except in compliance with the License.
 *
 * Copyright (c) 2021 humbertda
 */

import {OutputFormatter} from './output-formatter';
import {Rule} from './rules';

export interface Field {
    fieldName: string;
    validators: string[];
}

export interface EntityForm {
    entityName: string;
    fields: Field[];
}

export interface GeneratorResult {
    entityForms: EntityForm[];
}

export interface FormOpenApiGeneratorOption {
    specFileOrUrlPath: string;
    output: OutputFormatter;
    extraRules?: Rule[];
}
