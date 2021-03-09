/**
 * @license
 * Licensed under the MIT License, (“the License”); you may not use this
 * file except in compliance with the License.
 *
 * Copyright (c) 2021 humbertda
 */

import { OpenAPIV2 } from 'openapi-types';
import {Property, RuleResult} from './models';

export type Definition = OpenAPIV2.DefinitionsObject;

function angularRule(validator: string|null, propertyIfTrue?: Property): RuleResult|null {
    const prop: Property[]|null = (propertyIfTrue == null ? null : [
        propertyIfTrue
    ]);
    return (typeof validator === 'string' && validator.length) ?  {
        validators: [
            {
                definition: validator,
                import: {
                    path: '@angular/forms',
                    name: 'Validators'
                }
            }
        ],
        properties: prop
    } : null;
}

function hasMetadata(fieldName: string, definition: Definition, metadataName: string): boolean {
    return definition.properties[fieldName].hasOwnProperty(metadataName);
}

export function requiredRule(fieldName: string, definition: Definition): RuleResult|null {
    return angularRule(definition.required && definition.required.includes(fieldName) ? `Validators.required` : null, {
        type: 'boolean',
        name: 'isRequired',
        value: 'true'
    });
}

export function patternRule(fieldName: string, definition: Definition): RuleResult|null {
    return angularRule(hasMetadata(fieldName, definition, 'pattern')
        ? `Validators.pattern(/${definition.properties[fieldName]['pattern']}/)`
        : null);
}

export function minLengthRule(fieldName: string, definition: Definition): RuleResult|null {
    return angularRule(hasMetadata(fieldName, definition, 'minLength')
        ? `Validators.minLength(${definition.properties[fieldName]['minLength']})`
        : null, {
        value: definition.properties[fieldName]['minLength'],
        type: 'number',
        name: 'minLength'
    });
}

export function maxLengthRule(fieldName: string, definition: Definition): RuleResult|null {
    return angularRule(hasMetadata(fieldName, definition, 'maxLength')
        ? `Validators.maxLength(${definition.properties[fieldName]['maxLength']})`
        : null, {
        value: definition.properties[fieldName]['maxLength'],
        type: 'number',
        name: 'maxLength'
    });
}

export function emailRule(fieldName: string, definition: Definition): RuleResult|null {
    return angularRule(definition.properties[fieldName].format === 'email' ? `Validators.email` : '');
}
