require('dotenv').config();

exports.jwtSecret = process.env.JWT_TOKEN_SECRET;
exports.jwtSignatureOptions = {
  expiresIn: '7d',
};
