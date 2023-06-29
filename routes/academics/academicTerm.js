const express = require("express");
const { createAcademicTerm, getAcademicTerms, updateAcademicTerm, deleteAcademicTerm ,getSingleAcademicTerm} = require("../../controller/academics/academiceTermController");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

const academicTermRouter = express.Router(); 

//  academicYearRouter.post('/',isLogin,isAdmin,createAcademicYear)
//  academicYearRouter.get('/',isLogin,isAdmin,getAcademicYears)

// chaining route
academicTermRouter.route('/').post(isLogin,isAdmin,createAcademicTerm).get(isLogin,isAdmin,getAcademicTerms)

academicTermRouter.route('/:id').put(isLogin,isAdmin,updateAcademicTerm)
 .get(isLogin,isAdmin,getSingleAcademicTerm).delete(isLogin,isAdmin,deleteAcademicTerm)

 module.exports = academicTermRouter;