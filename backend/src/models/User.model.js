import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    //contains attributes odf the entity
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
         type: String,
        required: true
    },
    role:{

         type: String,
        enum:["student","instructor"],
        default: "student"
    },
    headline: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    }
});
//this method will run with
//user.create() => create new user call user.save()
// when update user 
UserSchema.pre("save",async function(){
    // encrypting password
    //used function keyword to have this referring to current user
    if(!this.isModified("password")) return;
    //new user object or old object with password modified
   this.password = await bcrypt.hash(this.password, 10);
  
});
UserSchema.methods.comparepassword = async function(candidatePassword){
   const isMatched =await bcrypt.compare(candidatePassword , this.password);
   return isMatched;
}
export default mongoose.model("User", UserSchema);