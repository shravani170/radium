const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'UserDBphase1',
            required: true, 
            unique: true
        },
        items:[ {_id:false,
          productId: {
              type: mongoose.Schema.Types.ObjectId, 
              ref: 'ProductProject5',
              required: true
            },
          quantity: {
              type: Number, 
              required: true
            
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
       
      }, { timestamps: true });

module.exports = mongoose.model('Project5Cart', cartSchema)