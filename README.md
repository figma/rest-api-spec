# rest-api-spec

This repository contains the OpenAPI specification and TypeScript types for the [Figma REST API](https://www.figma.com/developers/api).

[Changelog](https://www.figma.com/developers/api#changelog)

Note: this specification is currently in beta. If you notice any inaccuracies with the specification, please [file an issue](https://github.com/figma/rest-api-spec/issues) in this repository.

## Usage

The OpenAPI (v3.1.0) specification is located in the `openapi/` directory. This specification can be used with a [wide variety of tools](https://tools.openapis.org/) to generate API documentation, client SDKs, and more.

### OpenAPI Spec file

The OpenAPI specification is available as a YAML and JSON file in the `openapi/` directory.

To use the JSON specification in Node.js or TypeScript apps, install the package:

```sh
npm install @figma/rest-api-spec
```

#### In ES Modules

In EcmaScript modules, import the JSON file via `createRequire` as shown, as directly importing JSON files in Node is still considered experimental:

```ts
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const OpenAPISpec = require("@figma/rest-api-spec/openapi");

// You may now use `OpenAPISpec` as a JS object.
```

#### In CommonJS

In CommonJS files, you can directly require the JSON file:

```cjs
const OpenAPISpec = require("@figma/rest-api-spec/openapi");

// You may now use `OpenAPISpec` as a JS object.
```

#### With import attributes

If your JavaScript runtime or bundler supports import attributes, you may open the OpenAPI spec directly as a JS object:

```js
import OpenAPISpec from "@figma/rest-api-spec/openapi" with { type: "json" };

console.log(typeof OpenAPISpec); // object
```


### TypeScript type

The TypeScript types are generated from the OpenAPI specification and are located in `dist/`.

We use a custom code generator to convert the OpenAPI spec to TypeScript. While there are a number of existing OpenAPI-to-TypeScript code generators, we adopted a custom solution that produces output that we believe is more optimal for the Figma REST API. In particular:

- All OpenAPI schemas, responses, and request parameters are exported as named types. This exposes named types inside complex node properties (e.g. `Paint`, `VariableAlias`, etc...).
- Types directly associated with API endpoints are prefixed with the OpenAPI operation ID (e.g. `getFile` -> `GetFilePathParams`, `GetFileQueryParams`, `GetFileResponse`). For API endpoints expecting a request body, the types are suffixed with `RequestBody` (e.g. `postComments` -> `PostCommentsRequestBody`).

To use these types in your TypeScript code, install the package:

```sh
npm install --save-dev @figma/rest-api-spec
```

Then import the types that you need:

```ts
import { type GetFileResponse } from '@figma/rest-api-spec'

// Many popular HTTP clients let you annotate response types
const result = await axios.get<GetFileResponse>(url);
result.data // This has type GetFileResponse
```

