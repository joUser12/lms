const express = require("express");
const { createAcademicYear, getAcademicYears, getSingleAcademicYear, updateAcademicYear, deleteAcademicYear } = require("../../controller/academics/academiceYearController");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
 
const academicYearRouter = express.Router(); 

//  academicYearRouter.post('/',isLogin,isAdmin,createAcademicYear)
//  academicYearRouter.get('/',isLogin,isAdmin,getAcademicYears)

// chaining route
 academicYearRouter.route('/').post(isLogin,isAdmin,createAcademicYear).get(isLogin,isAdmin,getAcademicYears)

academicYearRouter.route('/:id').put(isLogin,isAdmin,updateAcademicYear)
 .get(isLogin,isAdmin,getSingleAcademicYear).delete(isLogin,isAdmin,deleteAcademicYear)
//  academicYearRouter.get('/:id',isLogin,isAdmin,getAllAcademicYear)
//  academicYearRouter.put('/:id',isLogin,isAdmin,updateAcademicYear)
//  academicYearRouter.delete('/:id',isLogin,isAdmin,deleteAcademicYear)

 module.exports = academicYearRouter;