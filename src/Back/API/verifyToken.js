const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    console.log("Token not provided");
    return res.status(401).json({ message: 'Token non fourni' });
  }

  try {
    const decodedToken = jwt.verify(token, 'QR)V!6;3gwhnW9vk%76G2?X7=');

    req.userData = decodedToken;

    // Vérifier la valeur de isAdmin
    if (decodedToken.isAdmin !== 1) {
      console.log("Access denied. User is not an admin.");
      return res.status(403).json({ message: 'Accès interdit. Vous n\'êtes pas administrateur.' });
    }


    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: 'Token invalide' });
  }
};


module.exports = verifyToken;
