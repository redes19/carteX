const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, secretKey);
    return decodedToken.userId; 
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

module.exports = getUserIdFromToken;
