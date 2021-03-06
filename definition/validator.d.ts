declare module '@iondrive/validation-middleware' {
  import express = require('express');

  interface JsonSchema {
    // number keywords
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: boolean;
    minimum?: number;
    exclusiveMinimum?: boolean;

    // string keywords
    maxLength?: number;
    minLength?: number;
    pattern?: string | RegExp;

    // array keywords
    additionalItems?: boolean | JsonSchema;
    items?: JsonSchema | JsonSchema[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;

    // object keywords
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    additionalProperties?: boolean | JsonSchema;
    properties?: { [name: string]: JsonSchema };
    patternProperties?: string | RegExp;
    dependencies?: { [name: string]: JsonSchema | string[] };

    // any type keywords
    enum?: any[];
    type?: string | string[];
    allOf?: JsonSchema[];
    anyOf?: JsonSchema[];
    oneOf?: JsonSchema[];
    not?: JsonSchema;
    definitions?: { [name: string]: JsonSchema };

    // metadata keywords
    title?: string;
    description?: string;
    default?: any;

    // format
    format?: string;
  }

  function addFormat(name: string, format: string | RegExp): void;
  function addSchema(name: string, schema: JsonSchema): void;

  interface IsMyJsonValidError {
    field: string;
    message: string;
    value?: any;
  }

  class ValidationError implements Error {
    public name: string;
    public message: string;
    public errors: IsMyJsonValidError[];
  }

  function body(schema: JsonSchema): express.RequestHandler;
  function query(schema: JsonSchema): express.RequestHandler;
  function params(schema: JsonSchema): express.RequestHandler;
}
