/**
 * @license
 * Licensed under the MIT License, (“the License”); you may not use this
 * file except in compliance with the License.
 *
 * Copyright (c) 2021 humbertda
 */

import {Project} from 'ts-morph';
import {OutputFormatter} from './output-formatter';
import {EntityForm, GeneratorResult, Property} from './models';
import {OutputFormatterOptions} from './output-formatter-options';
import camelcase from 'camelcase';
import prettier from 'prettier';

export class DefaultOutputFormatter implements OutputFormatter {

    private readonly options: OutputFormatterOptions;

    constructor(opts: Partial<OutputFormatterOptions>) {
        this.options = {...{
                filePrefix: '',
                fileSuffix: '',
                outputFolder: './',
                tslintOptions: {
                    parser: 'typescript',
                    singleQuote: true,
                    useTabs: false,
                    bracketSpacing: true,
                    tabWidth: 4
                }
            }, ...opts};
    }

    public async handleOutput(content: GeneratorResult): Promise<void> {
        const fileMap = new Map<string, string>();
        let indexContent = '';
        content.entityForms.forEach(entity => {
            const file = this.options.filePrefix + camelcase(entity.entityName) + this.options.fileSuffix;
            const fileName =  file + '.ts';
            const content = this.makeContent(entity);
            indexContent += `export { ${this.getTemplateName(entity)}, ${this.getFactoryName(entity)} } from './${file}';
`;
            fileMap.set(fileName, this.formatContent(content));
        });
        fileMap.set('index.ts', this.formatContent(indexContent));

        for(let file of fileMap.entries()) {
            await this.saveFile(file[1], file[0])
        }
    }

    private formatContent(content: string): string {
        return prettier.format(content, this.options.tslintOptions);
    }

    private static format(prop: Property): string {
        switch (prop.type) {
            case 'number':
                return `'${prop.name}': ${prop.value}`
            case 'string':
                return `'${prop.name}': '${prop.value}'`
            case 'boolean':
                return `'${prop.name}': ${prop.value}`
            default:
                throw new Error('out of range');
        }
    }

    private getTemplateName(entity: EntityForm): string {
        return camelcase(entity.entityName) + 'Template';
    }

    private getFactoryName(entity: EntityForm): string {
        return camelcase(entity.entityName, {pascalCase: true}) + 'Factory';
    }

    private makeContent(entity: EntityForm): string {
        const lineSep = `
                 `;
        let factoryFields: string[] = [];
        let templateFields: string[] = [];
        let imports = new Map<string, string[]>();
        imports.set('@angular/forms', ['FormGroup', 'FormBuilder'])
        entity.fields.forEach(o => {
            factoryFields.push(`'${o.fieldName}': [${o.validators.map(o => o.definition).join(', ')}]`);
            templateFields.push(`'${o.fieldName}': {
                ${o.properties.map(o => DefaultOutputFormatter.format(o)).join(',' + lineSep)}
            }`);
            o.validators.forEach(prop => {
                if (!imports.has(prop.import.path)) {
                    imports.set(prop.import.path, []);
                }
                const cRef = imports.get(prop.import.path);
                if (cRef != null) {
                    if(cRef.indexOf(prop.import.name) < 0) {
                        cRef.push(prop.import.name);
                    }
                }
            })
        });
        let importsValues: string[] = [];
        imports.forEach((value, key) => {
            importsValues.push(`import {${value.join(', ')}} from '${key}';`);
        });

        return `${importsValues.join(lineSep)}
        
        export const ${this.getTemplateName(entity)} = {
            ${templateFields.join(',' + lineSep)}
        }
        
        export class ${this.getFactoryName(entity)} {
        
            private readonly _fields = {
                ${factoryFields.join(`,
                 `)}
            };
            
            constructor(private readonly _formBuilder: FormBuilder) { }
            
            public fillForm(form: FormGroup): void {
                Object.keys(this._fields).forEach(fieldKey => {
                    form.addControl(fieldKey, this._formBuilder.control(null, this._fields[fieldKey]));
                });
            }
        }
        `;
    }

    private async saveFile(file: string, fileName: string): Promise<void> {
        const project = new Project();
        project.createSourceFile(this.options.outputFolder + fileName, file, { overwrite: true });
        return project.save();
    }


}

