import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

export const handleRegister = async (req, res) => {
  console.log("🚀 ~ handleRegister:", req.body);

  try {
    // Validation
    const { email, password, username } = req.body;

    if (!email || !password || !username)
      return res.send({ success: false, errorId: 1 });

    const salt = await bcrypt.genSalt(10);
    console.log("🚀 ~ salt:", salt);
    // pass: 1: $2b$10$AyqguNAEgjCT/FlzmEjIsO
    // pass: 1: $2b$31$K4/OKvKYXB7YhL5GJwReTe
    // $2b = algorithm
    // $10 = SAlTING ROUNDS
    // AyqguNAEgjCT/FlzmEjIsO = SALT

    const hashedPass = await bcrypt.hash(password, salt);
    console.log("🚀 ~ hashedPass:", hashedPass);
    // in db:  $2b$10$TU4KYgT0n84JUFlYSUDu0egIT6hdfc0i3khGMQljDNLaSxPHjeY8S
    //  salt: $2b$10$TU4KYgT0n84JUFlYSUDu0e
    // hashedPass: $2b$10$TU4KYgT0n84JUFlYSUDu0e = salt
    // gIT6hdfc0i3khGMQljDNLaSxPHjeY8S = hash

    req.body.password = hashedPass;
    console.log("🚀 ~ req.body:", req.body);

    const newUser = await User.create(req.body);
    console.log("🚀 ~ handleRegister:", newUser);

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });
    console.log("🚀 ~ token:", token);

    sendEmail(token);

    res.send({ success: true });
  } catch (error) {
    console.log("🚀 ~ error ADDING USER:", error.message);

    res.send({ success: false, message: error.message });
  }
};
export const handleLogin = async (req, res) => {
  console.log("🚀 ~ handleLogin:", req.body);

  try {
    const { usernameoremail, password } = req.body;

    if (!usernameoremail || !password)
      return res.send({ success: false, errorId: 1 });

    const user = await User.findOne({
      $or: [{ username: usernameoremail }, { email: usernameoremail }],
    }); // user found in database

    if (!user) return res.send({ success: false, errorId: 2 });

    if (!user.emailVerified) return res.send({ success: false, errorId: 3 });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.send({ success: false, errorId: 2 }); // pass don't match

    console.log("🚀 ~ handleLogin USER:", user);

    const newUser = user.toObject();
    delete newUser.password;
    console.log("🚀 ~ handleLogin USER AFTER PASSWORD DELETION:", newUser);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1h",
    });
    console.log("🚀 ~ token:", token);

    res.cookie("wdpt014", token);

    res.send({ success: true, user: newUser });
  } catch (error) {
    console.log("🚀 ~ error Login:", error.message);

    res.send({ success: false, message: error.message });
  }
};

export const handleUpdateProfile = async (req, res) => {
  console.log("🚀 ~ handleUpdateProfile:", req.body);
  console.log("🚀 ~ handleUpdateProfile FILE:", req.file);

  try {
    console.log("🚀 ~ handleUpdateProfile FILENAME:", req.file.filename);

    req.body.image = req.file.filename;

    const editedUser = await User.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    console.log("🚀 ~ editedUser:", editedUser);

    res.send("User Inserted into db");
  } catch (error) {
    console.log("🚀 ~ error handleUpdateProfile:", error.message);

    res.send("Error in handleUpdateProfile" + error.message);
  }
};
export const handleLogout = async (req, res) => {
  console.log("🚀 ~ handleLogout:");

  try {
    res.clearCookie("wdpt014");
    res.send("success logout");
  } catch (error) {
    console.log("🚀 ~ error handleLogout:", error.message);

    res.send("Error in Logout" + error.message);
  }
};
export const handleEmailConfirm = async (req, res) => {
  console.log("🚀 ~ handleEmailConfirm:", req.body);

  try {
    const decodedToken = jwt.verify(req.body.token, process.env.JWT_TOKEN);
    console.log("🚀 ~ decodedToken:", decodedToken);

    const user = await User.findByIdAndUpdate(
      decodedToken._id,
      {
        emailVerified: true,
      },
      { new: true }
    );
    console.log("🚀 ~ user:", user);

    if (!user) return res.send({ success: false, errorId: 1 });

    res.send({ success: true });
  } catch (error) {
    console.log("🚀 ~ error handleEmailConfirm:", error.message);

    res.send("Error in handleEmailConfirm" + error.message);
  }
};
export const handleForgotPass = async (req, res) => {
  console.log("🚀 ~ handleForgotPass:", req.body);

  try {
    const { usernameOrEmail } = req.body;

    if (!usernameOrEmail) return res.send({ success: false, errorId: 0 });

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    console.log("🚀 ~ user:", user);

    if (!user) return res.send({ success: false, errorId: 1 });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });
    console.log("🚀 ~ token:", token);

    sendEmail(token, "forgotPass");

    res.send({ success: true });
  } catch (error) {
    console.log("🚀 ~ error handleForgotPass:", error.message);

    res.send("Error in handleForgotPass" + error.message);
  }
};
export const handleChangePass = async (req, res) => {
  console.log("🚀 ~ handleChangePass:", req.body);

  try {
    const { token, password } = req.body;

    if (!token || !password) return res.send({ success: false, errorId: 0 });

    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
    console.log("🚀 ~ decodedToken:", decodedToken);

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = await User.findByIdAndUpdate(
      decodedToken._id,
      { password: hashedPass },
      { new: true }
    );
    console.log("🚀 ~ user:", user);

    if (!user) return res.send({ success: false, errorId: 1 });

    res.send({ success: true });
  } catch (error) {
    console.log("🚀 ~ error handleChangePass:", error.message);

    res.send("Error in handleChangePass" + error.message);
  }
};
