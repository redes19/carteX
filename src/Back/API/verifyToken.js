const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization.split(" ")[1];

  // Check if the token is not provided
  if (!token) {
    console.log("Token not provided");
    return res.status(401).json({ message: "Token non fourni" });
  }

  try {
    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, "QR)V!6;3gwhnW9vk%76G2?X7=");

    // Attach the decoded token to the request object
    req.userData = decodedToken;

    // Check if the user is not an admin
    if (decodedToken.isAdmin !== 1) {
      console.log("Access denied. User is not an admin.");
      return res
        .status(403)
        .json({ message: "Accès interdit. Vous n'êtes pas administrateur." });
    }

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = verifyToken;
