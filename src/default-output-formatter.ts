/**
 * @license
 * Licensed under the MIT License, (“the License”); you may not use this
 * file except in compliance with the License.
 *
 * Copyright (c) 2021 humbertda
 */

import {Project} from 'ts-morph';
import {OutputFormatter} from './output-formatter';
import {EntityForm, GeneratorResult} from './models';
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
            indexContent += `export * from './${file}';
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

    private makeContent(entity: EntityForm): string {
        let fields: string[] = [];
        entity.fields.forEach(o => {
            fields.push(`'${o.fieldName}': [${o.validators.join(', ')}]`);
        });

        return `import {FormGroup, Validators, FormBuilder} from '@angular/forms';
        
        export class ${camelcase(entity.entityName, {pascalCase: true})}Factory {
        
            private readonly _fields = {
                ${fields.join(`,
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

