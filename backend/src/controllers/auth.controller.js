    import User from '../models/User.model.js';
    import bcrypt from 'bcryptjs';
    import HTTPError from '../utils/HttpError.js';
    import jwt from 'jsonwebtoken';
    export const registration = async(req,res,next)=>{
        try{
         const{email,name,password,role} = req.body;
          const user= await User.create({email,name,password,  role: role || "student"});

         const { password: _, ...userData } = user.toObject();
         return res.status(201).json({ message: "User created successfully", user: userData });
        }catch(err){
            next(err);
        }
    };
    export const login = async(req,res,next)=>{
        try{
            const{email,password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(401).json({
                    message:"Wrong Email or password"
                })
            }
           const isMatched = await bcrypt.compare(password, user.password);
            if(!isMatched)
             return next(new HTTPError(401,"Wrong Email or password"));

            // generate jwt with user info
            //jwt.sign(payload,Sercret,object)
          const accessToken=  jwt.sign(
                {userId: user._id,role: user.role},
                process.env.JWT_ACCESS_TOKEN_SECRET,
              { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
            );
            const { password: _pw, ...safeUser } = user.toObject();
            return res.status(200).json({
                message:"user logged in successfully",
                accessToken,
                user: safeUser
            })
        }catch(err){
            next(err);
        }
    }