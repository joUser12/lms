const express = require("express");
const isLogin = require("../../middlewares/isLogin");
const isAdmin = require("../../middlewares/isAdmin");
const {
  createSubject,
  getSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
} = require("../../controller/academics/subjectController");
createSubject;
const subjectRouter = express.Router();

// chaining route
// subjectRouter.post("/:programID", isLogin, isAdmin, createSubject);
subjectRouter.route("/:programID").post(isLogin, isAdmin,createSubject);
subjectRouter.route("/").get(isLogin, isAdmin, getSubjects);

subjectRouter
  .route("/:id")
  .put(isLogin, isAdmin, updateSubject)
  .get(isLogin, isAdmin, getSingleSubject)
  .delete(isLogin, isAdmin, deleteSubject);

module.exports = subjectRouter;
