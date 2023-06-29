const express = require("express");
const { createYearGroup, getYearGroups, getSingleYearGroup, updateYearGroup, deleteYearGroup } = require("../../controller/academics/yearGroup");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const yearGroupRouter = express.Router(); 

// chaining route
yearGroupRouter.route('/').post(isLogin,isAdmin,createYearGroup).get(isLogin,isAdmin,getYearGroups)

yearGroupRouter.route('/:id').put(isLogin,isAdmin,updateYearGroup)
 .get(isLogin,isAdmin,getSingleYearGroup).delete(isLogin,isAdmin,deleteYearGroup)

 module.exports = yearGroupRouter;