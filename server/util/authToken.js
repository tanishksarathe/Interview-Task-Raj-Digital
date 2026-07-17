import jwt from "jsonwebtoken";

export const genToken = async (user, res) => {
  try {
    const payload = {
      id: user._id,
      role: user.role || "student",
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    console.log("Generated Token : ", token);

    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 60,
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax", // production = none, development = lax
    });
    
  } catch (error) {
    throw error;
  }
};
