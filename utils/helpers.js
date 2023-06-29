const bcrypt = require('bcryptjs');

// hash Password

exports.hashPassword =async (password,salt )=>{
    debugger
    // const salt = await bcrypt.getSalt(10);
    const hash = await bcrypt.hash(password,salt);
    return hash ;
    console.log(hash);
}

exports.isPassMatch =async (password,hash) =>{
 return await bcrypt.compare(password,hash)
}