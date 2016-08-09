const googleImages = require('google-images');import mongoose, { Schema } from 'mongoose';

mongoose.connect('mongodb://localhost:27017/productfinder');

mongoose.Promise = require('bluebird');

const productSchema = new Schema({
  name: String,
  barcode: {type: String, unique: true},
  description: String,
  image: String,
  views: Number
});

export default mongoose.model('Product', productSchema);
