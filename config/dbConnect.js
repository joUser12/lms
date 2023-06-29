const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DB connected Sucessfully");
  } catch (error) {
    console.log("DB connection failed", error.message);
  }
};

dbConnect();
