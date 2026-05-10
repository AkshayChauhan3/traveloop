const multer = require("multer");

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/userProfilePhoto/");
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },

});

// only stores image file
const fileFilter = (req, file, cb) => {

  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);

  } else {

    cb(new Error("Only PNG, JPG, JPEG images are allowed"), false);
  }
};

// upload and restriction of 5mb image size
const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

});

module.exports = upload;