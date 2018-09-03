const knex = require('../db/knex');

/**
 * @description Abstraction layer for validating api Request bodies
 */
class RequestSchemaValidator {
  /**
   * @param {string} table
   * @param {any} reqBody
   * @description Compares the request body property on the instance against the schema
   * associated with the table specified on the instance. Retuns an array of any missing
   * required properties. Can return empty.
   * @returns `Promise<any>`
   */
  validateRequestBody(table, reqBody) {
    const missingRequiredProperties = [];
    return new Promise((resolve, reject) => {
      knex(table)
        .columnInfo()
        .then((schema) => {
          Object.keys(schema).map((key) => {
            if (!schema[key].nullable && schema[key].defaultValue === null) {
              if (typeof reqBody[key] === 'undefined') {
                if (key !== 'user_id') {
                  return missingRequiredProperties.push(key);
                }
              }
            }
          });
        })
        .catch((err) => {
          reject(new Error(`Error validating request body: ${err}`));
        })
        .then(() => {
          resolve(missingRequiredProperties);
        });
    });
  }
}

module.exports = new RequestSchemaValidator();
