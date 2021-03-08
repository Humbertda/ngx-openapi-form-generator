# Angular Form Generator

Generates an Angular ReactiveForm from a Swagger or OpenAPI definition.

Based on [verizonconnect/ngx-form-generator][1] repository

## Install

```bash
# TODO installation process
```

## Usage

### CLI

```bash
# TODO CLI usage
```

| Option       | Alias            | Comment                                          | Required |
| ------------ | ---------------- | ------------------------------------------------ | -------- |
| --version    |                  | Show version number                              |          |
| --input-spec | -i, --swaggerUrl | Location of the OpenAPI spec as URL or file path | ✓        |
| --output     | -o, --outDir     | Folder where to write the generated files        |          |
| --help       | -h               | Show help                                        |          |

### Library Usage

```typescript
import { FormOpenapiGenerator, DefaultOutputFormatter } from 'ngx-openapi-form-generator';

async function main() {
    await FormOpenapiGenerator.from({
        specFileOrUrlPath: 'swagger.json',
        output: new DefaultOutputFormatter({
            outputFolder: 'projects/forms/src/lib'
        })
    });
}
await main();
```

## Reference

- [verizonconnect original repository][1]

[1]: https://github.com/verizonconnect/ngx-form-generator "Inspiration repository"
