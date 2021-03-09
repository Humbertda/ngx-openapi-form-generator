# Angular Form Generator

Generates an Angular ReactiveForm from a Swagger or OpenAPI definition.

Based on [verizonconnect/ngx-form-generator][1] repository

## Install

```bash
# install locally as development dependency in project (recommended)
npm i ngx-openapi-form-generator --save-dev

# install globally on your system (not recommended)
npm i ngx-openapi-form-generator -g
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
const {FormOpenapiGenerator, DefaultOutputFormatter} = require("ngx-openapi-form-generator");

// Basebath or file url to your OpenAPI definition
let specFileOrUrlPath = "https://localhost:5001/swagger/v1/swagger.json";

async function main() {
    return FormOpenapiGenerator.from({
        specFileOrUrlPath: specFileOrUrlPath,
        output: new DefaultOutputFormatter({
            outputFolder: 'src/my-api/form/'
        })
    });
}
main();
```

Run this fule using node command line.

## Usage

### Generation output

templateProperty.ts
```typescript
export interface TemplateProperty {
    isRequired?: boolean;
    maxLength?: number;
}
```

candidateProfileModel.ts
```typescript
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TemplateProperty } from './templateProperty';

export interface CandidateProfileEditModelTemplate {
    description: TemplateProperty;
    lastName: TemplateProperty;
    firstName: TemplateProperty;
    birthdate: TemplateProperty;
    placesDetailsResponse: TemplateProperty;
}

export const candidateProfileEditModelTemplate: CandidateProfileEditModelTemplate = {
    description: {
        maxLength: 2500
    },
    lastName: {
        maxLength: 150
    },
    firstName: {
        maxLength: 150
    },
    birthdate: {},
    placesDetailsResponse: {}
};

export class CandidateProfileEditModelFactory {
    private readonly _fields = {
        description: [Validators.maxLength(2500)],
        lastName: [Validators.maxLength(150)],
        firstName: [Validators.maxLength(150)],
        birthdate: [],
        placesDetailsResponse: []
    };

    constructor(private readonly _formBuilder: FormBuilder) {}

    public fillForm(form: FormGroup): void {
        Object.keys(this._fields).forEach(fieldKey => {
            form.addControl(
                fieldKey,
                this._formBuilder.control(null, this._fields[fieldKey])
            );
        });
    }
}
```


index.ts
```typescript
export {
    candidateProfileEditModelTemplate,
    CandidateProfileEditModelTemplate,
    CandidateProfileEditModelFactory
} from './candidateProfileEditModel';
export { TemplateProperty } from './templateProperty';
```

### Usage

app.component.ts
```typescript
import {
    CandidateProfileEditModel,
    CandidateProfileEditModelFactory,
    candidateProfileEditModelTemplate
} from './my-api/form';
// {...}

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    
    // {...}

    public readonly form: FormGroup;
    public readonly template: CandidateProfileEditModelTemplate = candidateProfileEditModelTemplate;

    constructor(private readonly _formBuilder: FormBuilder) {
        const formFactory = new CandidateProfileEditModelFactory(this._formBuilder);
        this.form = this._formBuilder.group({});
        formFactory.fillForm(this.form);
    }
    
    // {...}
}
```

app.component.html
```html
<form [formGroup]="form">
    <input [formControlName]="'lastName'"
           [maxlength]="template.lastName.maxLength">
</form>
```

### Advanced usage

This is recommended to use a directive automatically applying properties to your html fields. A very basic implementation could be:

```typescript
import {Directive, ElementRef, Input} from '@angular/core';
import {TemplateProperty} from './my-api/form';

@Directive({
    selector: '[validationModel]'
})
export class ValidationModelDirective {

    @Input()
    public set validationModel(val: TemplateProperty) {
        const input: HTMLInputElement|HTMLTextAreaElement = this.el.nativeElement;
        if (val.maxLength != null) {
            input.maxLength = val.maxLength;
        }
        if (val.isRequired != null) {
            input.required = val.isRequired;
        }
    }

    constructor(private readonly el: ElementRef) {
    }

}
```

And usage would be
```html
<form [formGroup]="form">
    <input [formControlName]="'lastName'"
           [validationModel]="template.lastName">
</form>
```

## Reference

- [verizonconnect original repository][1]

[1]: https://github.com/verizonconnect/ngx-form-generator "Inspiration repository"
