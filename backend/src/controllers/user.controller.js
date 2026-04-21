import fs from "fs";
import User from '../models/User.model.js'
import HTTPError from '../utils/HttpError.js';

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;


// get profile user 

export const getProfile =async(req,res,next)=>{
    try{
       const user = req.user;
       const {password:_,...userData} = user.toObject();
       res.status(200).json({
        message:"User",
        user:userData
       }) 
    }catch(err){next(err)}
}
// update profile 
export const updateProfile = async(req,res,next)=>{
    try{
        const user = req.user;
        const { name, email, headline, bio } = req.body;
        const update = {};
        if (name !== undefined) update.name = name;
        if (email !== undefined) update.email = email;
        if (headline !== undefined) update.headline = headline;
        if (bio !== undefined) update.bio = bio;
      const updatedUser = await User.findByIdAndUpdate(user._id, update, { new: true });
      if(!updatedUser) return next(new HTTPError(404, "User not found"));
      const {password:_,...userData} = updatedUser.toObject();
      res.status(200).json({ message: "Profile updated successfully", user: userData });
    }catch(err){
        next(err)
    }
}

export const uploadProfileAvatar = async (req, res, next) => {
    try {
        if (!req.file) return next(new HTTPError(400, "No image file received"));
        if (!req.file.mimetype?.startsWith("image/")) {
            return next(new HTTPError(400, "Only image files are allowed"));
        }
        const bytes = typeof req.file.size === "number" ? req.file.size : fs.statSync(req.file.path).size;
        if (bytes > MAX_AVATAR_BYTES) {
            return next(new HTTPError(400, "Image must be at most 5 MB"));
        }
        const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: avatarUrl },
            { new: true }
        );
        if (!updatedUser) return next(new HTTPError(404, "User not found"));
        const { password: _, ...userData } = updatedUser.toObject();
        res.status(200).json({ message: "Profile photo updated", user: userData });
    } catch (err) {
        next(err);
    }
};

// changePassword
export const changePassword =async(req,res,next) =>{
    try{
        const user = req.user;
        const {currentPassword, newPassword} = req.body;
        
        const isMatched = await user.comparepassword(currentPassword);
        if(!isMatched) return next(new HTTPError(401, "Current password is incorrect"));
      if(currentPassword === newPassword) return next(new HTTPError(400, "New password must be different"));
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: "Password changed successfully" });

    }catch(err){next(err)}
}
// deleteAccount
export const deleteAccount = async(req,res,next)=>{
    try{
        const user = req.user;
        const deleted = await User.findByIdAndDelete(user._id);
        if(!deleted) return next(new HTTPError(404, "User not found"));
       return res.status(200).json({ message: "user deleted successfully", deleted })
    }catch(err){next(err)}
}







