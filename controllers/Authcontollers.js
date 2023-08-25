import AuthModel from "../model/Authmodel.js";
import ExpModel from "../model/AddExpmodel.js";
import ProjectModel from "../model/AddProjectmodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Postmodel from "../model/Postmodel.js";

const secretKey = 'Nipundev'
export const AdminLogin = async (req, res) => {
  try {
    const {email,Password} = req.body;

    const user = await AuthModel.findOne({ email: email });
    console.log(user);

    if (user == null) {
      return res.status(400).json({ message: "Username not found.." });
    }

    const matchParrsword = await bcrypt.compare(Password, user.Password);
    if (!matchParrsword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(user.email, secretKey);
    res.status(200).json({ user , token });
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  try {
    const { email, Password } = req.body;
    console.log(email);
    // const ph = Phone;

    const user = await AuthModel.findOne({ email: email });
    console.log(user);

    if (user !== null) {
      return res.status(200).json({ message: "Already Registered" });
    }

    const saltRounds = 10;
    // Generate a salt
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            console.error("Error generating salt:", err);
            reject(err);
          }
  
          bcrypt.hash(Password, salt, (err, hash) => {
            if (err) {
              console.error("Error hashing password:", err);
              reject(err);
            }
  
            resolve(hash);
          });
        });
      });

    const result = await AuthModel.create({
      email: email,
      Password: hashedPassword,
    });

    console.log(result);

    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
  }
};

export const form1 = async (req,res) =>{
  const {firstname , lastname , headline , Education, id, Country, City, CurrentPos} = req.body;
    
  try {
    // Find the user by ID
    const user = await AuthModel.findById({_id:id});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.FirstName = firstname || user.FirstName;
    user.lastname = lastname || user.lastname;
    user.headline = headline || user.headline;
    user.Education = Education || user.Education;
    user.Country = Country || user.Country;
    user.City = City || user.City;
    user.CurrentPos = CurrentPos || user.CurrentPos;

    await user.save();
    return res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getprofiledata = async (req,res) =>{
  const _id = req.params.id;
  console.log(_id);
  try {
    const user = await AuthModel.findById(_id);
    console.log(user);
    res.status(200).json({user});
  } catch (error) {
    console.log(error);
  }
}

export const form2 = async(req,res) =>{
  const {textarea,id} = req.body;
  console.log(id);
  console.log(textarea);
  try {   
    const user  = await AuthModel.findById({_id:id});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(user);

    user.About = textarea || user.About;

    await user.save();
    return res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const addexpdata = async(req,res) =>{
  try {
    const {title , type , Company,Location , Ltype , id} = req.body;
    
    const experience = new ExpModel({
      title:title,
      type:type,
      Company:Company,
      Location:Location,
      Ltype:Ltype,
      id:id
    })

    await experience.save();
    res.status(200).json('added successfully');
  } catch (error) {
    console.log(error);
  }
}

export const EdataUp = async (req,res) =>{
  try {
    const {title,type,Company,Location , Ltype,_id} = req.body;

    const data = await ExpModel.findById({_id});

    // console.log("nsdjndvdsjjfsvjnjdsnjvs")
    console.log(data);
    // console.log("nsdjndvdsjjfsvjnjdsnjvs")

    data.title = title ; 
    data.type = type ;
    data.Company = Company ;
    data.Location = Location;
    data.Ltype = Ltype;

    console.log(data);

    await data.save();
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
}
export const ProUp = async (req,res) =>{
  try {
    const {ProjectName,AboutP,ProjectLink,_id} = req.body;

    const data = await ProjectModel.findById({_id});

    // console.log("nsdjndvdsjjfsvjnjdsnjvs")
    console.log(data);
    // console.log("nsdjndvdsjjfsvjnjdsnjvs")

    data.ProjectName = ProjectName ; 
    data.AboutP = AboutP ;
    data.ProjectLink = ProjectLink ;

    console.log(data);

    await data.save();
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
}


export const addprodata = async (req,res) =>{
  try {
    const {ProjectName , AboutP , ProjectLink ,id} = req.body;

    const project  = new ProjectModel({
      ProjectName:ProjectName,
      AboutP:AboutP,
      ProjectLink:ProjectLink,
      id:id
    })

    await project.save();
    res.status(200).json(' Project added successfully');
  } catch (error) {
    console.log(error);
  }
}

export const fetchexpdata = async (req,res) =>{
  const _id = req.params.id;
  console.log(_id);
  try {
    const data  = await ExpModel.find({id:_id});
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
export const fetchProdata = async (req,res) =>{
  const _id = req.params.id;
  console.log(_id);
  try {
    const data  = await ProjectModel.find({id:_id});
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

export const EditExp = async (req,res) =>{
  const _id = req.params.id;
  console.log(_id);
  try {
    const data  = await ExpModel.find({_id});
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
export const EditPro = async (req,res) =>{
  const _id = req.params.id;
  console.log(_id);
  try {
    const data  = await ProjectModel.find({_id});
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}

export const fetchdatPost = async (req,res) => {
  try {
    const ans = await Postmodel.find();
    console.log(ans);
    res.status(200).json(ans);
  } catch (error) {
    console.log(error);
  }
}