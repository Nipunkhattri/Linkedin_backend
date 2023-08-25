import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "./routers/product.js";
import { v2 as cloudinaryV2 } from 'cloudinary';
import { promises as fsPromises } from 'fs';
import {v2 as cloudinary} from 'cloudinary';
import { Readable } from 'stream';
import multer from 'multer'
import Authmodel from "./model/Authmodel.js";
import Postmodel from "./model/Postmodel.js";
cloudinary.config({ 
  cloud_name: 'dlc1gcuag', 
  api_key: '589645244337479', 
  api_secret: 'T1Iats7RXs8G4uMReBuCHOWPGJM' 
});
const app = express();
app.use(morgan("dev"));
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
dotenv.config();

app.use(cors());
app.use("/api", userRouter);

app.post('/upload', upload , async (req, res) => {
    try {
      const _id = req.body.id;
      if (!req.file) {
        return res.status(400).json({ message: 'No image provided' });
      }
  
      const uploadStream = cloudinaryV2.uploader.upload_stream(
        { folder: 'profile_images' },
        async (error, result) => {
          if (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ message: 'Server error' });
          }
          try {
            // Find the user by their ID and update their image field
            const user = await Authmodel.findById({_id});
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }

            user.image = result.secure_url;
            await user.save();

            res.status(200).json({ secure_url: result.secure_url });
          } catch (updateError) {
            console.error('Error updating user:', updateError);
            res.status(500).json({ message: 'Server error' });
          }
        }
      );
  
      const imageStream = new Readable();
      imageStream.push(req.file.buffer);
      imageStream.push(null);
      imageStream.pipe(uploadStream);
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.post('/api/post',upload , async (req,res)=>{
  try {
    console.log(req.body.id);
    const {text,id} = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    const user = await Authmodel.findById({_id:id});
    console.log(user);
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      { folder: 'profile_images' },
      async (error, result) => {
        if (error) {
          console.error('Error uploading image:', error);
          return res.status(500).json({ message: 'Server error' });
        }

        try {
          const data = new Postmodel({
            text:text,
            PostVim:result.secure_url,
            name:user.FirstName+' '+ user.lastname,
            image:user.image,
            id:user._id
          })
          await data.save();

          const ans = await Postmodel.find();
          console.log(ans);
          res.status(200).json(ans);

        } catch (updateError) {
          console.error('Error updating user:', updateError);
          res.status(500).json({ message: 'Server error' });
        }
      }
    );

    const imageStream = new Readable();
    imageStream.push(req.file.buffer);
    imageStream.push(null);
    imageStream.pipe(uploadStream);
  } catch (error) {
    console.log(error)
  }
})

app.get("/",(req,res)=>{
    res.json({message:"Hello"})
})

const port = 5000;

mongoose
.connect(process.env.MONGODB_URL)
.then(() => {
app.listen(port,"0.0.0.0", () => console.log(`Server running on port ${port}`));
}) 
.catch((error) => console.log(`${error} did not connect`))
