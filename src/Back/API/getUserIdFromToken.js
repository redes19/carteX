const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, 'QR)V!6;3gwhnW9vk%76G2?X7=');
    return decodedToken.userId; 
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

module.exports = getUserIdFromToken;
