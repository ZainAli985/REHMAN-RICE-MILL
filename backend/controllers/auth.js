import express from "express";
import Admin from "../models/admin-model.js";

export  const login = async (req,res) => {

    try{
    const {username, password} = req.body;

    const findAdmin = await Admin.findOne({username: username, password:password});

    const upperCaseUsername = username.toUpperCase();
    if(findAdmin){
        return res.status(200).json({message: `WELCOME ONBOARD ${upperCaseUsername}`});
    }
    else{
        return res.status(404).json({message: 'INVALID CREDENTIALS'})
    }
}
catch(err){
    res.status(500).json({message: "INTERNAL SERVER ERROR", err})
}



};