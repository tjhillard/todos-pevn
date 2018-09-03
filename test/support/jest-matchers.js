const Ajv = require('ajv');

const ajv = new Ajv();

global.expect.extend({
  toMatchJsonSchema(received, argument) {
    const valid = ajv.validate(argument, received);
    if (!valid) {
      return { pass: false, message: () => `Schema does not match. Errors: ${JSON.stringify(ajv.errors)}` };
    }
    return { pass: true };
  },
});
