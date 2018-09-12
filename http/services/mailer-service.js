const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SEND_GRID_KEY);

class Mailer {
  /**
   *
   * @param {string} toEmail The recipient email address
   * @returns {Promise}
   * @description Sends the welcome email to new users
   */
  sendWelcomeEmail(toEmail) {
    const message = {
      to: toEmail,
      from: 'no-reply@tjhillard.com',
      templateId: 'd-7ab0ff84093a417ab10cf76c29332aa7',
    };

    return sendgrid
      .send(message)
      .catch((err) => {
        console.error(err.response.body);
      });
  }

  /**
   *
   * @param {string} toEmail The recipient email address
   * @param {string} token The short duration JWT that will allow the user to change their password
   * @param {*} host The current server host used to redirect the user regardless of current environment
   * @param {*} callback Is called after email is sent (or send fails)
   */
  sendResetPasswordEmail(toEmail, token, host, callback) {
    const message = {
      to: toEmail,
      from: 'no-reply@tjhillard.com',
      templateId: 'd-e14a297bf0684d8c97694d5fba36136b',
      dynamic_template_data: {
        host,
        token,
      },
    };

    return sendgrid.send(message, (err, res) => {
      callback(err, res);
    });
  }
}

module.exports = new Mailer();
