interface IsMyJsonValidOptions {
  formats?: {
    [name: string]: RegExp
  };
  schemas?: {
    [name: string]: {}
  };
  verbose?: boolean;
  greedy?: boolean;
}

interface IsMyJsonValidError {
  field: string;
  message: string;
  value?: any;
}

interface Validator {
  (data: {}): boolean;
  errors: IsMyJsonValidError[]
}

declare module 'is-my-json-valid' {
  function validator(schema: {}, options?: IsMyJsonValidOptions): Validator;

  export = validator;
}
