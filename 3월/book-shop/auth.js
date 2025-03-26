const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req, res) => {
  try {
    const receivedJwt = req.headers['authorization'];
    if (!receivedJwt) {
      throw new ReferenceError('jwt must be provided');
    }
    const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    
    return decodedJwt;
  } catch (err) {
    console.log(err.name);
    console.log(err.message);

    return err;
  }
};

module.exports = ensureAuthorization;
