const express = require("express");

const adminRouter = express.Router(); 
const {registerAdminCtrl,loginAdminCtrl,getAllAdminCtrl,deleteAdminCtrl,getSingleProfileCtrl, updateAdminCtrl, adminUnSuspendTeacher, adminSuspendTeacher, adminUnPublishExamResult, adminPublishExamResult, adminUnWithdrawTeacher} = require("../../controller/Staff/adminController");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");

// admin register
adminRouter.post("/register",registerAdminCtrl);

// admin login
adminRouter.post("/login",loginAdminCtrl)


// Get all admins
adminRouter.get("/",isLogin,getAllAdminCtrl);

// get single admin
adminRouter.get("/profile",isLogin,isAdmin,getSingleProfileCtrl);

// update admin

adminRouter.put("/",isLogin,isAdmin,updateAdminCtrl);

// delete admin 
adminRouter.delete("/:id",deleteAdminCtrl);


// admin suspending teacher
adminRouter.put("/suspend/teacher/:id",adminSuspendTeacher);

// admin unsuspending teacher
adminRouter.put("/unsuspend/teacher/:id",adminUnSuspendTeacher);


// admin withdrwing teacher
adminRouter.put("/withdraw/teacher/:id",adminUnWithdrawTeacher);

// admin unwithdrwing teacher
adminRouter.put("/unwithdraw/teacher/:id",adminUnWithdrawTeacher);

// admin publish exam results teacher
adminRouter.put("/publish/exam/:id",adminPublishExamResult);

// admin unpublish exam results teacher
adminRouter.put("/unpublish/exam/:id",adminUnPublishExamResult);





module.exports= adminRouter;