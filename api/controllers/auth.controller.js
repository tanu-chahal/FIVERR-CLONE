import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req,res,next) =>{
    try{
        const hash = bcrypt.hashSync(req.body.password, 5);
        const newUser = new User({
            ...req.body,
            password: hash,
        })
        await newUser.save();
        res.status(201).json({newUser});
    } catch(err){
        next(err);
    }
}

export const login = async (req,res, next) =>{
    try{
        const user = await User.findOne({username: req.body.username});
        if(!user) return next(createError(404, "User not found!"));
        
        const isCorrect = bcrypt.compareSync(req.body.password, user.password);
        if(!isCorrect) return next(createError(400, "Incorrect password or username!"));

        const token = jwt.sign({
            id: user._id,
            isSeller: user.isSeller,
        }, process.env.JWT_SECRET_KEY);

        const {password, ...info} = user._doc; //so that we don't send the password.
        res.cookie("accessToken", token,{httpOnly: true, sameSite: "none", secure: true}).status(200).send(info); //
    } catch(err){
        next(err);
    }
}

export const logout = async (req,res) =>{
    res.clearCookie("accessToken",{
        sameSite: "none",
        secure: true,
    }).status(200).send("Logged out successfully.");
}