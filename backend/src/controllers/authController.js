// const userModel= require('../models/user.model');
import userModel from '../models/user.model.js';

export const registerUser=async(req, res)=>{
    const {username , email, password, admin = "false", phone, city}= req.body;

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            {username},
            {email},
            {phone}
        ]
    })

    if(isUserAlreadyExist){
        return res.status(409).json({message : "User already exist"});
    }


    const user = await  userModel.create({
        username,
        password,
        email,
        admin,
        phone, 
        city
    })

    //jwt tokens
}


export const loginUser= async (req, res)=>{

    const {username, password} = req.body;

    const user = await userModel.findOne({         
        username
    })
    if(!user) return res.status(401).json({message : "Invalid credential"})
    

        //password bycrpt
}



// module.exports= { registerUser, loginUser }
