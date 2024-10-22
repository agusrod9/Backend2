import mongoose from "mongoose";


mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({
    name :  {type: String, required: true},
    lastName : {type: String, required: true}
});

const model = new mongoose.model(collection,schema);

export default model;