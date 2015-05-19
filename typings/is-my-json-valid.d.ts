interface ValidatorOptions {
  formats?: {
    [name: string]: RegExp
  };
  schemas?: {
    [name: string]: {}
  };
  verbose?: boolean;
  greedy?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

interface Validator {
  (data: {}): boolean;
  errors: ValidationError[]
}

declare module 'is-my-json-valid' {
  function validator(schema: {}, options?: ValidatorOptions): Validator;

  export = validator;
}
