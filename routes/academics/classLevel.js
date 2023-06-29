const express = require("express");
const {createClassLevel,getclassLevels,getSingleClassLevel,updateClassLevel,deleteClassLevel} = require("../../controller/academics/classLevelController");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const classLevelRouter = express.Router(); 


// chaining route
classLevelRouter.route('/').post(isLogin,isAdmin,createClassLevel).get(isLogin,isAdmin,getclassLevels)

classLevelRouter.route('/:id').put(isLogin,isAdmin,updateClassLevel)
 .get(isLogin,isAdmin,getSingleClassLevel).delete(isLogin,isAdmin,deleteClassLevel)

 module.exports = classLevelRouter;