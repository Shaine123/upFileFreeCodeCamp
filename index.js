var express = require('express');
var cors = require('cors');
const multer = require('multer')
const path = require('path')
require('dotenv').config()

var app = express();


app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/public', express.static(process.cwd() + '/public'));

const storage = multer.diskStorage({
   destination: (req,file,cb) => {
      cb(null,'uploads')
   },
   filename: (req,file,cb) => {
    cb(null,`${file.fieldname}_${Date.now()}`)
  }
})

const upload = multer({storage})
const fs = require('fs')

const uploadFolder = path.join(__dirname,'/uploads') 

if(!fs.existsSync(uploadFolder)){
   fs.mkdirSync(uploadFolder)
}

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse',upload.single('upfile'),(req,res) => {
  try {
    console.log(req.file)
    res.json({
       name: req.file.originalname,
       type: req.file.mimetype ,
       size: req.file.size 
    })
  } catch (error) {
      console.log(error)
  }
})



const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
