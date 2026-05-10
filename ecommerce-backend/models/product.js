const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Please enter product name"],
    trim: true 
  },
  price: { 
    type: Number, 
    required: [true, "Please enter product price"],
    default: 0 
  },
  description: { 
    type: String, 
    required: [true, "Please enter product description"] 
  },
  category: { 
    type: String, 
    required: [true, "Please select category for this product"] 
  },
  stock: { 
    type: Number, 
    required: [true, "Please enter product stock"],
    default: 0 
  },
  images: [
    {
      url: { type: String, required: true }
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // ഏത് അഡ്മിൻ ആണ് ഇത് ചേർത്തതെന്ന് അറിയാൻ
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);