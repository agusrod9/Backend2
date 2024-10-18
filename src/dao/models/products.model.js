import mongoose from "mongoose";


mongoose.pluralize(null);

const collection = 'products';

const schema = new mongoose.Schema({
    title :  {type: String, required: true},
    description : {type: String, required: true},
    code : {type: Number, required: true, unique: true},
    price : {type: Number, required: true},
    status : {type: Boolean, required: true},
    stock : {type: Number, required: true},
    category : {type: String, required: true},
    thumbnails : {type: Array}
});

const model = new mongoose.model(collection,schema);

export default model;