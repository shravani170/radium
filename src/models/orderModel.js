const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'UserDBphase1',
        required: true
    },
    items: [{_id:false,
      productId: {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'ProductProject5',
          required: true
        },
      quantity: {
          type: Number, 
          required: true,
          min: 1
        }
    }],
    totalPrice: {
        type: Number, 
        required: true, 
        comment: "Holds total price of all the items in the cart"
    },
    totalItems: {
        type: Number, 
        required: true, 
        comment: "Holds total number of items in the cart"
    },
    totalQuantity: {type: Number, required: true, comment: "Holds total number of items in the cart"},
    cancellable: {type: Boolean, default: true},
    status: {type: String, default: 'pending', enum: ["pending", "completed", "canceled"]}
  }, { timestamps: true });

module.exports = mongoose.model('OrderProject5', orderSchema)