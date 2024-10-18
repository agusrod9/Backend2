import mongoose from "mongoose";


mongoose.pluralize(null);

const collection = 'carts';

const schema = new mongoose.Schema({});

const model = new mongoose.model(collection,schema);

export default model;


