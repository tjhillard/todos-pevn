require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./UserController');
const RespondWith = require('../services/response-service');

const jwtSecret = process.env.JWT_TOKEN_SECRET;
const jwtSignatureOptions = { expiresIn: '30m' };

class AuthService {
  /**
   *
   * @param {string} email
   * @param {string} password
   * @returns Promise
   * @description Creates new User resource, and returns a jwt.
   */
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
              user.id = id;
              user.password = undefined; // To prevent the password from being part of the jwt payload
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
                reject(RespondWith.internal500()); // fallback
              });
            }
          });
        }).catch((err) => {
          reject(RespondWith.internal500(err));
        });
    });
  }

  /**
   *
   * @param {string} email
   * @param {string} password
   * @returns Promise
   * @description Attempts to find a matching email/password and retunrs a jwt for matched user.
   */
  login(email, password) {
    return new Promise((resolve, reject) => {
      User.getOneByEmail(email)
        .then((user) => {
          if (user) {
            bcrypt
              .compare(password, user.password)
              .then((match) => {
                if (match) {
                  user.password = undefined; // To prevent the password from being part of the jwt payload
                  jwt.sign(user, jwtSecret, jwtSignatureOptions, (err, token) => {
                    if (err) {
                      reject(RespondWith.internal500(err));
                    }
                    if (token) {
                      resolve({
                        id: user.id,
                        token,
                      });
                    }
                    reject(RespondWith.internal500()); // fallback
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

  /**
   *
   * @param {string} oldToken The expired jwt that is request a new jwt
   * @returns {Promise<any>}
   * @description Attemps to generate a new jwt for a user with an expired one.
   */
  getRefreshToken(oldToken) {
    return new Promise((resolve, reject) => {
      jwt.verify(oldToken, jwtSecret, (err, decoded) => {
        if (err) {
          if (err.message === 'jwt expired') {
            const oldTokenPayload = jwt.decode(oldToken);
            const newTokenPayload = { id: oldTokenPayload.id, email: oldTokenPayload.email };
            jwt.sign(newTokenPayload, jwtSecret, jwtSignatureOptions, (signErr, newToken) => {
              if (signErr) {
                console.log(signErr);
                reject(RespondWith.internal500(err));
              }
              if (newToken) {
                resolve({
                  id: oldTokenPayload.id,
                  token: newToken,
                });
              }
            });
          }
        } else {
          reject(RespondWith.internal500(err));
        }
      });
    });
  }

  /**
   *
   * @param {string} email
   * @returns Promise
   * @description Returns a fast expiring jwt for a user by provided email.
   */
  resetPassword(email) {
    return new Promise((resolve, reject) => {
      User
        .getOneByEmail(email)
        .then((user) => {
          if (user) {
            user.password = undefined;
            jwt.sign(user, jwtSecret, { expiresIn: '10m' }, (err, token) => {
              if (err) {
                reject(RespondWith.internal500(err));
              }
              if (token) {
                resolve({
                  id: user.id,
                  token,
                });
              }
              reject(RespondWith.internal500()); // fallback
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
