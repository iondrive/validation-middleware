import express = require('express');

declare module '@iondrive/validation-middleware' {
  interface logger {
    addFormat(name: string, format: RegExp): void;
    addSchema(name: string, schema: {}): void;

    body(schema: {}): express.RequestHandler;
    query(schema: {}): express.RequestHandler;
    params(schema: {}): express.RequestHandler;
  };
  export = logger;
}
