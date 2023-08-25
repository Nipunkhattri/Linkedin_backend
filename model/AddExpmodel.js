import mongoose from "mongoose";

const AddExperience = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    Company:{
        type:String,
        required:true
    },
    Location:{
        type:String,
        required:true
    },
    Ltype:{
        type:String,
        required:true
    },
    id:{
        type:String,
        required:true
    }
})

export default mongoose.model('Exp', AddExperience);