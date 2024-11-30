import mongoose from "mongoose";


mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({
    firstName :  {type: String, required: true},
    lastName : {type: String, required: true},
    email : {type: String, required: true, index: true, unique: true},
    password: { type: String, required: true },
    role : {type: String, default: 'USER', enum:['USER','ADMIN','PREM']},
    verifiedUser: {type: Boolean, default: false},
    verificationCode: {type: String, default:''}
});

const model = new mongoose.model(collection,schema);

export default model;