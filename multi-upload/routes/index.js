var express = require('express');
var multer  = require('multer');
const mongoose = require('mongoose');
const productModel = require('../model/product');

var router = express.Router();

mongoose.connect('mongodb://localhost:27017/taolaodb', { useNewUrlParser: true, useUnifiedTopology: true }, (err)=> {
  if(!err)
  {
    console.log("Conected sucessfully");
  }
  else 
  {
    console.log("Conecttion was failed");
  }
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

var upload = multer({ storage: storage });

var uploadImages = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Multi upload' });
});

/* GET multiupload page. */
router.post('/multiupload',upload.any(), function(req, res, next) {
  uploadImages.push(req.files[0].path);
  res.status(200).send(req.files);  
});

/* POST addproduct page. */
router.post('/addproduct', function(req, res, next) {
  var productName = req.body.productName;
  var productPrice = req.body.productPrice;
  
  var oneProduct = {
    "name": productName,
    "price": productPrice,
    "images": uploadImages
  };

  var data = new productModel(oneProduct);

  data.save(); 

  console.log(uploadImages);
  console.log(productName + ' --- ' + productPrice);

  res.redirect("/products");
});

/* GET products page. */
router.get('/products', function(req, res, next) {
  productModel.find({}, (err, data) => { //covert from function(err, data) to arrow function 
    res.render('products', { title: 'Products', data: data });
  });
  
});

module.exports = router;
