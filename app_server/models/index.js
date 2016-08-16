import mongoose, { Schema } from 'mongoose';

mongoose.connect('mongodb://localhost:27017/productfinder');
mongoose.Promise = global.Promise;


export { default as Product } from './product';