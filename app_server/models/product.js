import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: String,
  barcode: {type: String, unique: true},
  description: String,
  image: String,
  views: Number
});

export default mongoose.model('Product', productSchema);
