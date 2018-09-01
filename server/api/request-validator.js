const knex = require('../db/knex');

module.exports = class ValidationService {
  constructor(table, reqBody = {}) {
    if (!table) throw new Error('ValidationService:constructor() requires "table"');
    if (!reqBody) throw new Error('ValidationService:constructor() requires "table"');
    this.table = table;
    this.reqBody = reqBody;
  }

  /**
   * @method
   * @description Compares the request body property on the instance against the schema
   * associated with the table specified on the instance. Retuns an array of any missing
   * required properties. Can return empty.
   * @returns `Promise<Array>`
   */
  validateRequestBody() {
    const missingRequiredProperties = [];
    return new Promise((resolve, reject) => {
      knex(this.table)
        .columnInfo()
        .then((schema) => {
          Object.keys(schema).map((key) => {
            if (!schema[key].nullable && schema[key].defaultValue === null) {
              if (typeof this.reqBody[key] === 'undefined') {
                return missingRequiredProperties.push(key);
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
};
