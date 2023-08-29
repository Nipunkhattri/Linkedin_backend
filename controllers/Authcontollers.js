import AuthModel from "../model/Authmodel.js";
import ExpModel from "../model/AddExpmodel.js";
import ProjectModel from "../model/AddProjectmodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Postmodel from "../model/Postmodel.js";
import EventModel from "../model/EventModel.js";

const secretKey = 'Nipundev'
export const AdminLogin = async (req, res) => {
  try {
    const {email,Password} = req.body;

    const user = await AuthModel.findOne({ email: email });
    console.log(user);

    if (user == null) {
      return res.status(400).json({ message: "User not found.." });
    }
    if(user?.Password == "GoogleSignIn"){
      return res.status(400).json({ message: "You have directly Logged in with google" });
    }

    const matchParrsword = await bcrypt.compare(Password, user.Password);
    if (!matchParrsword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(user.email, secretKey);
    res.status(200).json({ user , token ,message:"Login successfull .."});
  } catch (error) {
    console.log(error);
  }
};

export const GoogleLogin = async (req,res) =>{
  try {
    const {email , image} = req.body;

    const existingUser = await AuthModel.findOne({ email });
    if (existingUser) {
      const token = jwt.sign({ email: existingUser.email }, secretKey);
      return res.status(200).json({ user: existingUser, token, message: "Login successful." });
    }

    const user = await AuthModel.create({
      email: email,
      image:image,
      Password: "GoogleSignIn"
    });    

    console.log(user);
    const token = jwt.sign(user.email, secretKey);
    res.status(200).json({ user , token ,message:"Login successfull .."});
  } catch (error) {
    console.log(error);
    res.status(400).json({message:"Error Occurred"})
  }
}

export const Register = async (req, res) => {
  try {
    const { email, Password } = req.body;
    console.log(email);
    // const ph = Phone;

    const user = await AuthModel.findOne({ email: email });
    console.log(user);

    if (user !== null) {
      return res.status(400).json({ message: "Already Registered" });
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

    res.status(200).json({ message: "Registered Successfully" });
  } catch (error) {
    res.status(200).json({ message: "Something went wrong ! Try again" });
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
    res.status(200).json({result:user});
  } catch (error) {
    console.log(error);
  }
}

export const getuserdata = async (req,res) =>{
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
    res.status(400).json('Something Went Wrong');
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
export const fetchdatEvent = async (req,res) => {
  try {
    const ans = await EventModel.find();
    console.log(ans);
    res.status(200).json(ans);
  } catch (error) {
    console.log(error);
  }
}

export const authfollow = async (req,res) =>{
  try {
    const {id,rid} = req.body;
    const userToFollow = await AuthModel.findById({_id:rid});
    const userwhoFollow = await AuthModel.findById({_id:id});

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!userwhoFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const name = userwhoFollow?.FirstName + ' ' + userwhoFollow?.lastname;
    const image = userwhoFollow?.image;

    if (!userToFollow.followers.includes(id)) {
      userToFollow.request.push({ id, rid, name,image,boolean: false });      await userToFollow.save();

      return res.status(200).json({ message: "Request Send successfully" });
    } else {
      return res.status(400).json({ message: "Already following this user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const authrequest = async (req,res) =>{
  try {
    const {request,id,rid} = req.body;
    console.log(req.body);
    if( request == 'accept'){
      const userToFollow = await AuthModel.findById({_id:id});
      if (!userToFollow) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!userToFollow.followers.includes(rid)) {
        userToFollow.followers.push(rid);
        await userToFollow.save();
        userToFollow.request = userToFollow.request.filter(item => item.id !== rid);
        await userToFollow.save();  
  
        return res.status(200).json({ message: "Request Accepted successfully" });
      } else {
        return res.status(400).json({ message: "Already following this user" });
      }
    }
    else{
      const userToFollow = await AuthModel.findById({_id:id});
      if (!userToFollow) {
        return res.status(404).json({ message: "User not found" });
      }
        userToFollow.request = userToFollow.request.filter(item => item.rid !== rid);
        await userToFollow.save();
        return res.status(200).json({ message: "Request Rejected" });
    }
  } catch (error) {
    console.log(error);
  }
}

export const addlike = async (req,res) =>{
  try {
    const {_id , postid} = req.body;

    const postuser = await Postmodel.findById({_id:postid});

    console.log(postuser);
    if (!postuser) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if(!postuser.Like.includes(_id)){
      console.log(_id);
      postuser.Like.push(_id);
      await postuser.save();
      console.log(postuser);
      return res.status(200).json({ message: "Liked Post" });
    }
    else{
      postuser.Like = postuser.Like.filter(item => item !== _id);
      await postuser.save();
      return res.status(200).json({ message: "Disliked Post" });
    }
  } catch (error) {
    console.log(error);
  }
}

export const addcomment = async (req,res)=>{
  try {
    const {comment,_id,postid} = req.body;

    const postuser = await Postmodel.findById({_id:postid});

    console.log(postuser);
    if (!postuser) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userwhoFollow = await AuthModel.findById(_id);
    if (!userwhoFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const name = userwhoFollow?.FirstName + ' ' + userwhoFollow?.lastname;
    const image = userwhoFollow?.image;

    await postuser.Comment.push({image,name,_id,comment});
    await postuser.save();
    return res.status(200).json("Commented Successfully");
  } catch (error) {
    console.log(error);
  }
}

export const getnames = async (req,res)=>{
  try {
    const result = await AuthModel.find();
    console.log(result);
    const namesArray = result.map((item) => ({
      _id: item._id,
      name: item.FirstName + ' ' + item.lastname,
      image:item?.image
    }));
    return res.status(200).json(namesArray);
  } catch (error) {
    console.log(error)
  }
}