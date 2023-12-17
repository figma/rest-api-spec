# rest-api-spec

This repository contains the OpenAPI specification and Typescript types for the [Figma REST API](https://www.figma.com/developers/api).

[Changelog](https://www.figma.com/developers/api#changelog)

Note: we are releasing the OpenAPI specification as a beta given the large surface area and complexity of the REST API. If you notice any inaccuracies with the specification, please [file an issue](https://github.com/figma/rest-api-spec/issues).

## Usage

The OpenAPI (v3.1.0) specification is located in the `openapi/` directory. This specification can be used with a [wide variety of tools](https://tools.openapis.org/) to generate API documentation, client SDKs, and more.

The Typescript types are generated from the OpenAPI specification and are located in `dist/`. While there are a number of existing OpenAPI to Typescript code generators, we are generating our own types with some stylistic choices we believe are more optimal for development with the REST API:

- All OpenAPI schemas, responses, and request parameters are exported as named types. This exposes named types inside complex node properties (e.g. `Paint`, `VariableAlias`, etc...).
- Types directly associated with API endpoints are prefixed with the OpenAPI operation ID (e.g. `getFile` -> `GetFilePathParams`, `GetFileQueryParams`, `GetFileResponse`). API endpoints expecting a request body are suffixed with `RequestBody` (e.g. `postComments` -> `PostCommentsRequestBody`).

To use these types in your Typescript code, install the package:

```sh
npm install --save-dev @figma/rest-api-spec
```

Then import the types that you need:

```ts
import { GetFileResponse } from '@figma/rest-api-spec'

// Many popular HTTP clients let you annotate response types
const result = await axios.get<GetFileResponse>(url);
result.data // This has type GetFileResponse
```

