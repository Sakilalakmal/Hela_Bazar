const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');


// configure cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

//configure multer storage cloudinary
const storage =  new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"hela_bazar",
        format:async(req,file)=>{'png'},
        public_id:(req,file)=> file.filename + '_' + Date.now(),
        transformation:[
            {width:500, height:500 , crop:'fill'}
        ]
    }
});

//configure multer 
const upload = multer({
    storage:storage,
    limits:{fieldSize : 5 * 1024 * 1024}, //limit upto 5 mb
    fileFilter:function(req,file,cb){
        if(file.mimetype.startsWith('image/')){
            cb(null , true);
        }else{
            return cb(new Error('only image files are allowed'),false);
        }
    }

});

module.exports = {cloudinary,storage,upload};