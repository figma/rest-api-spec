# rest-api-spec

This repository contains the OpenAPI specification and Typescript types for the [Figma REST API](https://www.figma.com/developers/api).

[Changelog](https://www.figma.com/developers/api#changelog)

Note: this specification is currently in beta. If you notice any inaccuracies with the specification, please [file an issue](https://github.com/figma/rest-api-spec/issues) in this repository.

## Usage

The OpenAPI (v3.1.0) specification is located in the `openapi/` directory. This specification can be used with a [wide variety of tools](https://tools.openapis.org/) to generate API documentation, client SDKs, and more.

The Typescript types are generated from the OpenAPI specification and are located in `dist/`.

We use a custom code generator to convert the OpenAPI spec to TypeScript. While there are a number of existing OpenAPI-to-Typescript code generators, we adopted a custom solution that produces output that we believe is more optimal for the Figma REST API. In particular:

- All OpenAPI schemas, responses, and request parameters are exported as named types. This exposes named types inside complex node properties (e.g. `Paint`, `VariableAlias`, etc...).
- Types directly associated with API endpoints are prefixed with the OpenAPI operation ID (e.g. `getFile` -> `GetFilePathParams`, `GetFileQueryParams`, `GetFileResponse`). For API endpoints expecting a request body, the types are suffixed with `RequestBody` (e.g. `postComments` -> `PostCommentsRequestBody`).

To use these types in your Typescript code, install the package:

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

