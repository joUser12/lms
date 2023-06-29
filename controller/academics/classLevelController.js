const asyncHandler = require("express-async-handler");
const Admin = require("../../model/Staff/Admin");
const ClassLevels = require("../../model/Academic/ClassLevel");

// @desc createclassLevels
// @route POST/api/class-levels
// @acess Private
exports.createClassLevel = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  // check if exists
  const classLevel = await ClassLevels.findOne({ name });
  if (classLevel) {
    throw new Error("ClassLevel already exists");
  }
  //   create
  const classLevelcreated = await ClassLevels.create({
    name,
    description,
    createdBy: req.userAuth._id,
  });

  // push academic into admin
  const admin = await Admin.findById(req.userAuth._id);
  admin.classLevels.push(classLevelcreated._id);
  await admin.save();
  res.status(201).json({
    status: "success",
    message: "class Level Created Successfully",
    data: classLevelcreated,
  });
});

// @desc getclassLevels
// @route GET/api/class-levels
// @acess Private
exports.getclassLevels = asyncHandler(async (req, res) => {
  const classLevels = await ClassLevels.find();
  res.status(201).json({
    status: "success",
    message: "ClassLevels fetched Successfully",
    data: classLevels,
  });
});

// @desc getSingleclassLevel
// @route GET/api/class-levels/:id
// @acess Private
exports.getSingleClassLevel = asyncHandler(async (req, res) => {
  const classLevel = await ClassLevels.findById(req.params.id);
  if (classLevel) {
    res.status(201).json({
      status: "success",
      message: "ClassLevel fetched Successfully",
      data: classLevel,
    });
  } else {
    res.status(201).json({
      status: "failed",
      message: "not exists",
      data: null,
    });
  }
});

// @desc updateSingleclassLevel
// @route PUT/api/class-levels/:id
// @acess Private
exports.updateClassLevel= asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // check name exists
  const createClassLevelFound = await ClassLevels.findOne({ name });
  if (createClassLevelFound) {
    throw new Error("create ClassLevel already exists");
  }

  const classLevel = await ClassLevels.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      createdBy: req.userAuth.id,
    },
    {
      new: true,
    }
  );
  res.status(201).json({
    status: "success",
    message: "ClassLevel update Successfully",
    data: classLevel,
  });
});

// @desc deleteSingleclassLevel
// @route DELETE/api/class-levels/:id
// @acess Private
exports.deleteClassLevel = asyncHandler(async (req, res) => {
  await ClassLevels.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "ClassLevel delete Successfully",
  });
});
