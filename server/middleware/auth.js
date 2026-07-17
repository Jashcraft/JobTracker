const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Looks the user up on every request (rather than trusting the token payload
// alone) so a deleted account's existing token stops working immediately.
async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    // Rejects tokens issued before the most recent password change, so a
    // reset (self-service or admin-forced) logs out any other active session
    // immediately instead of waiting out the token's expiry.
    if (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt.getTime()) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }
    req.user = user;
    req.userId = user._id.toString();
    req.userRole = user.role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session" });
  }
}

function requireAdmin(req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
