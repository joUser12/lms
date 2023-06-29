const Teacher = require("../../model/Staff/Teacher");
const asyncHandler = require("express-async-handler");
// const generateToken = require("../../utils/generateToken");
// const verifyToken = require("../../utils/verifyToken");
const { hashPassword, isPassMatch } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");

// @desc Admin Register Teacher
// @route POST/api/teachers/admin/register
// @acess Private
exports.adminRegisterTeacher = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // check if teacher already exists
  const teacher = await Teacher.findOne({ email });

  if (teacher) {
    throw new Error("Teacher already employed");
  }
  //   //   Hash password
  //   const hashedPassword = await hashPassword(password);
  // create
  const teacherCreated = await Teacher.create({
    name,
    email,
    password: await hashPassword(password, 10),
  });
  console.log(teacherCreated);
  // send teacher data
  res.status(201).json({
    status: "success",
    message: "Teacher registered Successfully",
    data: teacherCreated,
  });
});

// @desc  Teacher login
// @route POST/api/teachers/login
// @acess Private

exports.teacherLogin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // find the user
  const teacher = await Teacher.findOne({ email });
  if (!teacher) {
    return res, json({ message: "Invalid login credentials" });
  }
  //   verify password
  const isMatched = await isPassMatch(password, teacher.password);
  if (!isMatched) {
    return res.json({ message: "Invalid login credentials" });
  } else {
    res.status(200).json({
      status: "success",
      message: "Teacher logged in successfully",
      data: generateToken(teacher._id),
    });
  }
  // send teacher data
  res.status(201).json({
    status: "success",
    message: "Teacher registered Successfully",
    data: teacherCreated,
  });
});

// @desc  GetAll teacher admin
// @route POST/api/teachers/admin
// @acess Private admin only

exports.getAllTeacher = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find().select("-password");
  res.status(200).json({
    status: "success",
    message: "teachers fetched successfully",
    data: teachers,
  });
});

// @desc  GetSingleteacher admin
// @route POST/api/teachers/admin
// @acess Private admin only

exports.getTeacherById = asyncHandler(async (req, res) => {
  const teacherId = req.params.teacherID;
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new Error("teacher not found");
  }
  res.status(200).json({
    status: "success",
    message: "teacher fetched successfully",
    data: teacher,
  });
});

// @desc  Getteacher profile
// @route POST/api/teachers/profile
// @acess Private admin only

exports.getTeacherProfile = asyncHandler(async (req, res) => {
  console.log(req.userAuth);
  const teacher = await Teacher.findById(req.userAuth?._id).select(
    "-password -createdAt -updatedAt"
  );
  if (!teacher) {
    throw new Error("teacher not found");
  }
  res.status(200).json({
    status: "success",
    message: "teacher  profile fetched successfully",
    data: teacher,
  });
});

// @desc  update teacher
// @route PUT/api/teachers/:id/update
// @acess Private
exports.teacherUpdateProfile = asyncHandler(async (req, res) => {
  console.log(req.userAuth._id);
  const { email, name, password } = req.body;
  // if email is taken
  const emailExist = await Teacher.findOne({ email });
  if (emailExist) {
    throw new Error("this is email exist/taken");
  }
  if (password) {
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        password: await hashPassword(password),
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "teacher updated sucessfully",
    });
  } else {
    const teacher = await Teacher.findByIdAndUpdate(
      req.userAuth._id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: teacher,
      message: "teacher updated sucessfully",
    });
  }
});

// @desc admin  update teacher profile
// @route PUT/api/teachers/:id/update
// @acess Privateadmin only
exports.adminUpdateTeacherProfile = asyncHandler(async (req, res) => {
  const { program, classLevel, academicYear, subject } = req.body;

  const teacherFound = await Teacher.findById(req.params.teacherID);
  if (!teacherFound) {
    throw new Error("teacher not found");
  }

  if(teacherFound.isWitdrawn){
    throw new Error("Action denied");
  }
  // assign a program
  if(program){
    teacherFound.program = program;
    await teacherFound.save();
  }

  // assign class level
  if(classLevel){
    teacherFound.classLevel = classLevel;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "teacher updated sucessfully",
    });
  }

   // assign subject
   if(subject){
    teacherFound.subject = subject;
    await teacherFound.save();
    res.status(200).json({
      status: "success",
      data: teacherFound,
      message: "teacher updated sucessfully",
    });
  }

    // assign academicYear
    if(academicYear){
      teacherFound.academicYear = academicYear;
      await teacherFound.save();
      res.status(200).json({
        status: "success",
        data: teacherFound,
        message: "teacher updated sucessfully",
      });
    }

  // res.status(200).json({
  //   status: "success",
  //   data: teacher,
  //   message: "teacher updated sucessfully",
  // });
});
