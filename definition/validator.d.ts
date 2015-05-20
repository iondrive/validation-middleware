declare module '@iondrive/validation-middleware' {
  import express = require('express');

  var logger: {
    addFormat(name: string, format: RegExp): void;
    addSchema(name: string, schema: {}): void;

    body(schema: {}): express.RequestHandler;
    query(schema: {}): express.RequestHandler;
    params(schema: {}): express.RequestHandler;
  };
  export = logger;
}
