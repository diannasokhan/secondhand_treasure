const path = require("path")
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })


const listingController = require("../controllers/listingController")

router.get("/listings/index", listingController.index)
router.get("/listings/new", listingController.new);
router.post("/listings/new", upload.single("myFile"), listingController.create);

module.exports = router;