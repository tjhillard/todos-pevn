const validator = require('validator');

module.exports = {

  /**
   *
   * @param {string} email
   */
  isValidEmail(email) {
    try {
      if (typeof email === 'string') {
        return validator.isEmail(email);
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  isValidPassword(password) {
    try {
      if (password) {
        if (password.length > 6) {
          return true;
        }
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  },

};
