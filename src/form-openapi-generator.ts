/**
 * @license
 * Licensed under the MIT License, (“the License”); you may not use this
 * file except in compliance with the License.
 *
 * Copyright (c) 2021 humbertda
 */

import {Definition, emailRule, maxLengthRule, minLengthRule, patternRule, requiredRule} from './rules';
import {OpenAPI, OpenAPIV2, OpenAPIV3} from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser';
import {EntityForm, Field, FormOpenApiGeneratorOption, GeneratorResult, Rule, RuleResult} from './models';

export class FormOpenapiGenerator {

    private static readonly DEFAULT_RULES: Rule[] = [requiredRule, patternRule, minLengthRule, maxLengthRule, emailRule];

    private rules: Rule[] = [...FormOpenapiGenerator.DEFAULT_RULES];

    public addRule(rule: Rule): void {
        this.rules.push(rule);
    }

    public resetRules(): void {
        this.rules = [...FormOpenapiGenerator.DEFAULT_RULES];
    }

    public clearAllRules(): void {
        this.rules = [];
    }

    private build(document: OpenAPI.Document): GeneratorResult {
        return this.makeForm(document);
    }

    public static async from(opts: FormOpenApiGeneratorOption): Promise<void> {
        const parser = new SwaggerParser();
        const generator = new FormOpenapiGenerator();
        const document = await parser.dereference(opts.specFileOrUrlPath);
        if(opts.extraRules) {
            opts.extraRules.forEach(r =>{
                if (r) {
                    generator.addRule(r);
                }
            })
        }
        const result = generator.build(document);
        await opts.output.handleOutput(result);
    }

    private constructor() {
    }


    ///// Builder


    private makeDefinition(definitionName: string, definition: Definition): EntityForm {
        return {
            entityName: definitionName,
            fields: this.makeFieldsBody(definition)
        }
    }

    private makeFieldsBody(definition: Definition): Field[] {
        if ('allOf' in definition) {
            const definitionKeys = Object.keys(definition.allOf);
            const allOfFieldsBody = definitionKeys
                .map(key => this.makeFieldsBody(definition.allOf[key]))
                .reduce((acc, val) => acc.concat(val), []);

            return allOfFieldsBody;
        }
        if ('type' in definition) {
            if (typeof definition.type === 'string') {
                switch (definition.type) {
                    case 'object':
                        const fields = definition.properties != null
                            ? Object.keys(definition.properties)
                            : [];
                        const fieldsBody = fields
                            .map(fieldName => this.makeField(fieldName, definition))
                            .filter(item => item.fieldName !== '');
                        return fieldsBody;
                }
            }
        }
        console.warn(definition);
        console.warn("---");
        return [];
    }

    private makeForm(spec: OpenAPI.Document): GeneratorResult {
        let definitions: OpenAPIV2.DefinitionsObject | OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | undefined;
        if ('definitions' in spec) {
            definitions = spec.definitions;
        } else if ('components' in spec) {
            definitions = spec.components?.schemas;
        } else {
            throw new Error('Cannot find schemas/definitions');
        }

        if (!definitions) {
            throw new Error('Cannot find schemas/definitions');
        }

        const definitionKeys = Object.keys(definitions);

        const forms: EntityForm[] = definitionKeys
            .map(key => this.makeDefinition(key, (definitions as Record<string, Definition>)[key]))
            .filter(item => item.entityName != '');

        return {
            entityForms: forms
        };
    }

    private makeField(fieldName: string, definition: Definition): Field {
        const ruleResults = this.makeFieldRules(fieldName, definition);
        const res: Field = {
            fieldName: fieldName,
            validators: [],
            properties: []
        }
        ruleResults.forEach(itm => {
            if (itm.validators != null) {
                itm.validators.forEach(validator => {
                    res.validators.push(validator);
                })
            }
            if (itm.properties != null) {
                itm.properties.forEach(property => {
                    res.properties.push(property);
                })
            }
        });
        return res;
    }

    private makeFieldRules(fieldName: string, definition: Definition): RuleResult[] {
        const res: RuleResult[] = [];
        this.rules.forEach(rule => {
            const ruleResult = rule(fieldName, definition);
            if(ruleResult != null) {
                res.push(ruleResult);
            }
        })
        return res;
    }
}

