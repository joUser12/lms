const express = require("express");
const cors = require('cors')
const morgan = require("morgan");
const adminRouter = require("../routes/Staff/adminRouter");
const {
  globalErrorHandler,
  notFoundErr,
} = require("../middlewares/globalErrorHandler");
const academicYearRouter = require("../routes/academics/academicYear");
const academicTermRouter = require("../routes/academics/academicTerm");
const classLevelRouter = require("../routes/academics/classLevel");
const programRouter = require("../routes/academics/programs");
const subjectRouter = require("../routes/academics/subjects");
const yearGroupRouter = require("../routes/academics/yearGroup");
const Teacher = require("../model/Staff/Teacher");
const teacherRouter = require("../routes/Staff/teacherRouter");
const examRouter = require("../routes/academics/exam");
const studentRouter = require("../routes/Staff/student");
const questionRouter = require("../routes/academics/question");

const app = express();
// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors())

// middle ware
// app.use((req, res, next) => {
//   console.log("middleware");
//   console.log(`${req.method}  ${req.originalUrl}`);
//   next();
// });

// Routes
// admin register
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/academic-years", academicYearRouter);
app.use("/api/v1/academic-terms", academicTermRouter);
app.use("/api/v1/class-level", classLevelRouter);
app.use("/api/v1/program", programRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/yeargroup", yearGroupRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/question", questionRouter);
// Error Handling
app.use(globalErrorHandler);
app.use(notFoundErr);

// admin login
// app.use("/api/v1/admins",adminRouter)

// Get all admins
// app.use("/api/v1/admins",(req,res)=>{
//     try{
//         res.status(201).json({
//             status:"success",
//             data:"all admins"
//         })

//     }catch(error){
//         res.json({
//             status:"failed",
//             error:error.message
//         })
//     }
// })

// Get single admin
// app.use("/api/v1/admins",(req,res)=>{
//     try{
//         res.status(201).json({
//             status:"success",
//             data:"single admin"
//         })
//     }catch(error){
//         res.json({
//             status:"failed",
//             error:error.message
//         })
//     }
// })

// update admin
// app.use("/api/v1/admins",(req,res)=>{
//     try{
//         res.status(201).json({
//             status:"success",
//             data:"update  admin"
//         })
//     }catch(error){
//         res.json({
//             status:"failed",
//             error:error.message
//         })
//     }
// })

// delete admin
// app.use("/api/v1/admins",(req,res)=>{
//     try{
//         res.status(201).json({
//             status:"success",
//             data:"delete  admin"
//         })
//     }catch(error){
//         res.json({
//             status:"failed",
//             error:error.message
//         })
//     }
// })

// admin suspending teacher
// app.use("/api/v1/admins",(req,res)=>{
//     try{
//         res.status(201).json({
//             status:"success",
//             data:"admin suspend teacher"
//         })
//     }catch(error){
//         res.json({
//             status:"failed",
//             error:error.message
//         })
//     }
// })

// admin unsuspending teacher
// app.use("/api/v1/admins",(req,res)=>{
//     try{
//         res.status(201).json({
//             status:"success",
//             data:"admin unsuspend teacher"
//         })
//     }catch(error){
//         res.json({
//             status:"failed",
//             error:error.message
//         })
//     }
// });

// admin withdrwing teacher
// app.use("/api/v1/admins",(req,res)=>{
//     try{
//         res.status(201).json({
//             status:"success",
//             data:"admin withdraw teacher"
//         })
//     }catch(error){
//         res.json({
//             status:"failed",
//             error:error.message
//         })
//     }
// });

// admin Unwithdrwing teacher
// app.use("/api/v1/admins",(req,res)=>{
//     try{
//         res.status(201).json({
//             status:"success",
//             data:"admin unwithdraw teacher"
//         })
//     }catch(error){
//         res.json({
//             status:"failed",
//             error:error.message
//         })
//     }
// });

// admin publish exam results teacher
// app.use("/api/v1/admins/publish/exam/:id",(req,res)=>{
//     try{
//         res.status(201).json({
//             status:"success",
//             data:"admin publish exam "
//         })
//     }catch(error){
//         res.json({
//             status:"failed",
//             error:error.message
//         })
//     }
// });

// admin unpublish exam results teacher
// app.use("/api/v1/admins/unpublish/exam/:id",(req,res)=>{
//     try{
//         res.status(201).json({
//             status:"success",
//             data:"admin unpublish exam  teacher"
//         })
//     }catch(error){
//         res.json({
//             status:"failed",
//             error:error.message
//         })
//     }
// });
module.exports = app;
