# @iondrive/validation-middleware

A JSON Schema validation middleware module for Node.js/io.js.

[![Build Status][travis-image]][travis-url]

## Install

```bash
npm install @iondrive/validation-middleware
```

## Usage

```js
const express = require('express');
const bodyParser = require('body-parser');
const validate = require('@iondrive/validation-middleware');

const app = express();
app.use(bodyParser.json());

const greetingSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  },
  required: ['name']
};
app.get('/greeting', validate.body(greetingSchema), function (req, res) {
  res.send('Hello there ' + req.body.name + '!');
});

app.listen(3000);
```

## License

[MIT](LICENSE)

[travis-image]: https://img.shields.io/travis/iondrive/validation-middleware.svg
[travis-url]: https://travis-ci.org/iondrive/validation-middleware
