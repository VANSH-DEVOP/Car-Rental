const jwt = require("jsonwebtoken");

let warnedMissingSecret = false;

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send("No token, authorization denied");
    }

    // Expected format: Authorization: Bearer <token>
    // Also allow passing the raw token value for compatibility.
    const parts = String(authHeader).trim().split(/\s+/);
    const token =
      parts.length === 2 && parts[0].toLowerCase() === "bearer"
        ? parts[1]
        : authHeader;

    if (!token) {
      return res.status(401).send("No token, authorization denied");
    }

    const secret = process.env.JWT_SECRET || "defaultsecret";
    if (!process.env.JWT_SECRET) {
      if (!warnedMissingSecret) {
        warnedMissingSecret = true;
        // eslint-disable-next-line no-console
        console.warn(
          "JWT_SECRET is not set; falling back to defaultsecret (insecure for production)."
        );
      }
    }

    const decoded = jwt.verify(
      token,
      secret
    );

    req.user = decoded; // attach user to request
    next();
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};

module.exports = authMiddleware;