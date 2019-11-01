const path = require("path")
const express = require("express");
const router = express.Router();
const validation = require("./validation");
const helper = require("../auth/helpers");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
aws.config.update({
  secretAccessKey: process.env.secretAccessKey,
  accessKeyId: process.env.accessKeyId,
  region: "us-east-1"
})

const s3 = new aws.S3();


const upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: 'secondhandtreasure',
      key: (req, file, cb) => {
        cb(null, file.fieldname + '-' + new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname))
      }
  })
});

const listingController = require("../controllers/listingController")

router.get("/listings/index", listingController.index)
router.get("/listings/new", listingController.new);
router.post("/listings/new", helper.ensureAuthenticated, upload.single("myFile"), validation.validateListings, listingController.create);
router.get("/listings/:id", listingController.show);
router.post("/listings/:id/destroy", listingController.destroy);
router.get("/listings/:id/edit", listingController.edit);
router.post("/listings/:id/update", validation.validateListings, listingController.update);

module.exports = router;