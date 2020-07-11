const jwt = require('jsonwebtoken');
const fs = require('fs-extra');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not Authenticated.');
    error.statusCode = 401;
    throw error;
  }
  
  const token = authHeader.split(' ')[1];
  const jwtVerifyOptions = {
    algorithms: ['HS256'],
    expiresIn: '1h'
  };
  
  let _PUBLIC_KEY = fs.readFileSync('./secret/jwtPublicKey.key.pub', 'utf8');
  let _PRIVATE_KEY = fs.readFileSync('./secret/jwtPrivateKey.key', 'utf8');
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, _PRIVATE_KEY, jwtVerifyOptions);
  } catch (error) {
    error.statusCode = 500;
    throw error;  
  }

  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
}