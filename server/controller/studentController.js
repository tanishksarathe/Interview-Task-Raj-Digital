import User from "../models/userModel.js";

export const getListOfAllStudents = async (req, res, next) => {
  try {
    const list = await User.find({ role: "student" });
    console.log(list);

    res.status(200).json({message: "Fetched All Students", data:list});

  } catch (error) {
    next(error);
  }
};
