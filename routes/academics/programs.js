const express = require("express");
const { createProgram, getPrograms, getSingleProgram, updateProgram, deleteProgram } = require("../../controller/academics/programController");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const programRouter = express.Router(); 

// chaining route
programRouter.route('/').post(isLogin,isAdmin,createProgram).get(isLogin,isAdmin,getPrograms)

programRouter.route('/:id').put(isLogin,isAdmin,updateProgram)
 .get(isLogin,isAdmin,getSingleProgram).delete(isLogin,isAdmin,deleteProgram)

 module.exports = programRouter;