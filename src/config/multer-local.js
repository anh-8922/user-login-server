// SIMPLE CONFIGURATION OF MULTER
// const upload = multer({ dest: "./server/uploads" });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./server/uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

//     let extension = "";

//     // get the rest of string after 5th character
//     if (file.mimetype.includes("image"))
//       extension = "." + file.mimetype.slice(6);
//     console.log("🚀 ~ extension:", extension);

//     console.log("INSIDE STORAGE OBJECT: file=", file);

//     cb(null, file.fieldname + "-" + uniqueSuffix + extension);
//   },
// });

// const upload = multer({ storage: storage });
