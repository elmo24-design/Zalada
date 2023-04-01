import express from "express";
const router = express.Router()
import path from 'path'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary';

const storage = multer.diskStorage({
   destination(req, file, cb){
      cb(null, 'uploads/')
   },
   filename(req, file, cb){
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
   }
})

function checkFileType(file, cb){
   const filetypes = /jpg|jpeg|png/
   const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
   const mimetype = filetypes.test(file.mimetype)

   if(extname && mimetype){
      return cb(null, true)
   }else{
      cb('Images only!')
   }
}

const upload = multer({
   storage,
   fileFilter: function(req, file, cb){
      checkFileType(file, cb)
   }
})

// configure cloudinary
cloudinary.config({
   cloud_name: 'day58jujg',
   api_key: '341172781363147',
   api_secret: '5xWMIrzD4744TedSBV6PmGj_n04',
});

router.post('/', upload.single('image'), async(req, res) => {
   // res.send(`/${req.file.path}`)
   try {
      // upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
  
      // res.status(201).json({
      //   message: 'Image uploaded successfully',
      //   imageUrl: result.secure_url,
      // });

      res.send(result.secure_url)

    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Failed to upload image',
      });
    }
})

export default router