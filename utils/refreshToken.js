const jwt = require("jsonwebtoken");

const generateToken = id => {
    return jwt.sign({ id }, "anyKey", { expiresIn: "1d" })
}

module.exports = generateToken;