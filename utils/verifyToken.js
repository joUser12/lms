const jwt = require("jsonwebtoken");

const verifyToken = token=>{
    // console.log(token);
    return jwt.verify(token,"anyKey",(err,decoded)=>{
        if(err){
            // return {
            //     msg:"Invalid token"
            // }
            return  false;
        }else{
            return decoded;
        }
    })
}


module.exports = verifyToken;