const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SEND_GRID_KEY);

class Mailer {
  // Welcome a new user
  sendWelcomeEmail(toEmail) {
    if (!toEmail) { throw new Error('Trying to send email without to field'); }
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

  // Reset password link
  sendResetPasswordEmail(toEmail, token, host) {
    if (!toEmail) { throw new Error('Trying to send email without to field'); }
    const message = {
      to: toEmail,
      from: 'no-reply@tjhillard.com',
      templateId: 'd-e14a297bf0684d8c97694d5fba36136b',
      dynamic_template_data: {
        host,
        token,
      },
    };

    return sendgrid
      .send(message)
      .catch((err) => {
        console.error(err.response.body);
      });
  }
}

module.exports = new Mailer();
