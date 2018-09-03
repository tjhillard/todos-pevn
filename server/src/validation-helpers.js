const validator = require('validator');

module.exports = {

  /**
   *
   * @param {string} email
   */
  isValidEmail(email) {
    try {
      return validator.isEmail(email);
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
