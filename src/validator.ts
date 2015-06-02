import express = require('express');
import validator = require('is-my-json-valid');

const formats: { [name: string]: RegExp } = {};
const schemas: { [name: string]: {} } = {};

export function addFormat(name: string, format: RegExp) {
  formats[name] = format;
}

export function addSchema(name: string, schema: {}) {
  schemas[name] = schema;
}

export class ValidationError implements Error {
  public name = 'ValidationError';
  public message: string;

  constructor(public errors: IsMyJsonValidError[]) {
    this.message = `Validation failed with ${errors.length} error${errors.length === 1 ? '' : 's'}. See the \'errors\' property for details.`;
  }
}

function makeMiddleware(field: string) {
  return function (schema: {}) {
    var validate = validator(schema, {
      formats: formats,
      schemas: schemas,
      greedy: true
    });

    return <express.RequestHandler>function (req, res, next) {
      if (validate((<any>req)[field])) return next();

      next(new ValidationError(validate.errors.map(function (error) {
        error.field = error.field.replace(/^data./, '');
        return error;
      })));
    };
  }
}

export var body = makeMiddleware('body');
export var query = makeMiddleware('query');
export var params = makeMiddleware('params');
