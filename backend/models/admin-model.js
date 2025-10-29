import express from "express";
import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    username: {type: String, required:true},
    password: {type: String, required:true}
});

const Admin =  mongoose.model('admin', adminSchema);

export default Admin;