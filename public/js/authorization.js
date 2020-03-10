const jwt = require("jsonwebtoken");

function authorize(req, res, next) {
    const authorizationToken = req.session.token;
    if (!authorizationToken) return res.sendStatus(401);
    jwt.verify(authorizationToken, process.env.JWT_SECRET, (err) => {
        if (err) res.sendStatus(403);
    });
    next();
}

module.exports = authorize;
