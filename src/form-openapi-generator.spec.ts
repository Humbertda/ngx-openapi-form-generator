
import { FormOpenapiGenerator } from './form-openapi-generator';
import {DefaultOutputFormatter} from './default-output-formatter';

describe('FormOpenapiGenerator', () => {
    it('should be created', async () => {

        await FormOpenapiGenerator.from({
            output: new DefaultOutputFormatter({
                fileSuffix: '_suffix',
                filePrefix: 'prefix_',
                outputFolder: './test_output/pets1/'
            }),
            specFileOrUrlPath: 'src/fixtures/pets.json'
        })

        await FormOpenapiGenerator.from({
            output: new DefaultOutputFormatter({
                fileSuffix: '_suffix',
                filePrefix: 'prefix_',
                outputFolder: './test_output/example1/'
            }),
            specFileOrUrlPath: 'src/fixtures/example1.json'
        })

        await FormOpenapiGenerator.from({
            output: new DefaultOutputFormatter({
                fileSuffix: '_suffix',
                filePrefix: 'prefix_',
                outputFolder: './test_output/example2/'
            }),
            specFileOrUrlPath: 'src/fixtures/example2.json'
        })
    });
});
