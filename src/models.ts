/**
 * @license
 * Licensed under the MIT License, (“the License”); you may not use this
 * file except in compliance with the License.
 *
 * Copyright (c) 2021 humbertda
 */

import {OutputFormatter} from './output-formatter';
import {Definition} from './rules';

export interface Field {
    fieldName: string;
    validators: Validator[];
    properties: Property[];
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

export type Property = {
    type: 'number'|'string'|'boolean';
    name: string;
    value: string;
}

export type Validator = {
    definition: string;
    import: Import;
}

export type Import = {
    path: string;
    name: string;
};

export type RuleResult = {
    validators: Validator[]|null;
    properties: Property[]|null;
};

export type Rule = (fieldName: string, properties: Definition) => RuleResult|null;
