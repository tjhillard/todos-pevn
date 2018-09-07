require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../controllers/UserController');
const RespondWith = require('../services/response-service');

const jwtSecret = process.env.JWT_TOKEN_SECRET;
const jwtSignatureOptions = { expiresIn: '7d' };

class AuthService {
  signup(email, password) {
    return new Promise((resolve, reject) => {
      // hash password
      bcrypt.hash(password, 10)
        .then((hash) => {
          const user = {
            email,
            password: hash,
          };
          User.create(user).then((id) => {
            if (id) {
              user.password = undefined;
              jwt.sign(user, jwtSecret, jwtSignatureOptions, (err, token) => {
                if (err) {
                  reject(RespondWith.internal500(err));
                }
                if (token) {
                  resolve({
                    id,
                    token,
                  });
                }
                reject(RespondWith.internal500()); // just in case
              });
            }
          });
        }).catch((err) => {
          reject(RespondWith.internal500(err));
        });
    });
  }

  login(email, password) {
    return new Promise((resolve, reject) => {
      User.getOneByEmail(email)
        .then((user) => {
          if (user) {
            bcrypt
              .compare(password, user.password)
              .then((match) => {
                if (match) {
                  user.password = undefined;
                  jwt.sign(user, jwtSecret, jwtSignatureOptions, (err, token) => {
                    if (err) {
                      reject(RespondWith.internal500(err));
                    }
                    resolve({
                      id: user.id,
                      token,
                    });
                  });
                } else {
                  reject(RespondWith.badRequest400({}, 'Email and password do not match.'));
                }
              })
              .catch((err) => {
                reject(err);
              });
          } else {
            reject(RespondWith.badRequest400({}, 'Could not find a user with provided email address in our system.'));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = new AuthService();
