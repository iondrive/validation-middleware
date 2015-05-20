declare module '@iondrive/validation-middleware' {
  import express = require('express');

  module validator {
    export function addFormat(name: string, format: RegExp): void;
    export function addSchema(name: string, schema: {}): void;

    export function body(schema: {}): express.RequestHandler
    export function query(schema: {}): express.RequestHandler
    export function params(schema: {}): express.RequestHandler
  }

  export = validator;
}
