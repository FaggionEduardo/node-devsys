const jwt = require("express-jwt");
require("dotenv").config({ path: ".env" });
const db = require("_helpers/db");

module.exports = authorize;

function authorize() {
  return [
    // authenticate JWT token and attach decoded token to request as req.user
    jwt({ secret: process.env.AUTH_SECRET, algorithms: ["HS256"] }),

    // attach full user record to request object
    async (req, res, next) => {
      // get user with id from token 'sub' (subject) property
      const user = await db.User.findByPk(req.user.sub);

      // check user still exists
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      // authorization successful
      req.user = user.get();
      next();
    },
  ];
}