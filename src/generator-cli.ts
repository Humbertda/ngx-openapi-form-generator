#! /usr/bin/env node

/**
 * @license
 * Licensed under the MIT License, (“the License”); you may not use this
 * file except in compliance with the License.
 *
 * Copyright (c) 2021 humbertda
 */

import { join } from 'path';
import {FormOpenapiGenerator} from './form-openapi-generator';
import {DefaultOutputFormatter} from './default-output-formatter';
const yargs = require('yargs');

async function main(): Promise<void> {
    const argv = yargs
        .option('input-spec', {
            alias: ['i', 'swaggerUrl'],
            description: 'Location of the OpenAPI spec as a URL or file path',
            type: 'string',
            require: true
        })
        .option('output', {
            alias: ['o', 'outDir'],
            description: 'Where to write the generated files',
            type: 'string'
        })
        .help()
        .wrap(null)
        .usage('Generates Angular ReactiveForms from an OpenAPI v2 or v3 spec.\n\n Usage: $0 -i <spec> -o <path>')
        .example('ngx-openapi-form-generator -i https://petstore.swagger.io/v2/swagger.json -o petstore-forms')
        .example('ngx-openapi-form-generator -i https://petstore.swagger.io/v2/swagger.yaml -o petstore-forms')
        .alias('help', 'h').argv;

    await FormOpenapiGenerator.from({
        specFileOrUrlPath: argv['input-spec'],
        output: new DefaultOutputFormatter({
            outputFolder: argv['output']
        })
    })
}

main();
