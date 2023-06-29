const Admin = require("../model/Staff/Admin");
const verifyToken = require("../utils/verifyToken");
const isLogin = async (req, res, next) => {
  // get token from header

  const headerObj = req.headers;
  const token =
    headerObj &&
    headerObj.authorization &&
    headerObj.authorization.split(" ")[1];
  // const isLogin = req.userAuth
  // if(isLogin){
  //     next()
  // }else {
  //     const err  = new Error (" Your not login");
  //     next(err);
  // }
  // verify token
  const verifiedToken = verifyToken(token);

  if (verifiedToken) {
    // find the admin
    const user = await Admin.findById(verifiedToken.id);
    // const user = await Admin.findById(verifiedToken.id).select("name email role")
    req.userAuth = user;
    // console.log(req.userAuth);
    next();
  } else {
    const err = new Error("Token expired/invalid");
    next(err);
  }
};

module.exports = isLogin;
