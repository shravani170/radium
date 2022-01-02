const CartModel = require("../models/cartModel")
const productModel = require('../models/productModel')
const UserModel = require("../models/User Model")
const mongoose = require("mongoose")
const validate = require("../Util/Validation")



const createCart = async (req, res) => {
    try {
        let requestbody = req.body
        const UserId = req.params.userId
        TokenDetail = req.user

        if (!(validate.isValidObjectId(UserId))) {
            return res.status(400).send({ status: false, message: 'Please provide valid userId' })
        }

        if (TokenDetail.userId != UserId) {
            res.status(401).send({ status: false, message: "userId in url param and in token is not same" })
            return
        }
        if (!validate.isValidRequestBody(requestbody)) {
            res.status(400).send({ status: false, message: 'Please provide Cart(Items) details' })
            return
        }

        if (!validate.isValid(requestbody.items[0].productId)) {
            return res.status(400).send({ status: false, message: ' Please provide productId' })
        }


        if (!validate.isValid(requestbody.items[0].quantity)) {
            return res.status(400).send({ status: false, message: ' Please provide quantity' })
        }
        if (!(requestbody.items[0].quantity >= 1)) {
            return res.status(400).send({ status: false, message: 'atleast 1 quantity is required for Product.' })
        }

        let findCart = await CartModel.findOne({ userId: UserId });
        if (findCart) {
            const { items } = requestbody;
            for (let i = 0; i < items.length; i++) {
                let product = await productModel.findOne({ _id: (items[i].productId) })
                let ProductIndex = findCart.items.findIndex(p => p.productId == items[i].productId)
                console.log(ProductIndex)
                if (ProductIndex > -1) {//index key match i.e. product id match,means product with same id already in cart ,so product updation in same product
                    findCart.items[ProductIndex].quantity = findCart.items[ProductIndex].quantity + items[i].quantity;
                    await findCart.save();
                    findCart.totalPrice = findCart.totalPrice + ((items[i].quantity) * (product.price))
                    await findCart.save();
                    return res.status(200).send({ status: true, data: findCart })

                } else {//if product id dosent match add another product in cart

                    TotalPrice = findCart.totalPrice + ((items[i].quantity) * (product.price))
                    TotalItems = findCart.totalItems + 1;
                    const cartdetail = await CartModel.findOneAndUpdate({ userId: findCart.userId }, { $addToSet: { items: { $each: items } }, totalPrice: TotalPrice, totalItems: TotalItems }, { new: true })

                    return res.status(200).send({ status: true, data: cartdetail })
                }

            }

        }
        if (!findCart) {
            const { items } = requestbody;
            for (let i = 0; i < items.length; i++) {
                const product = await productModel.findOne({ _id: (items[i].productId) })
                let price = product.price;
                let total = (items[i].quantity) * price;
                let TotalItems = 1
                const newCart = {
                    userId: UserId,
                    items: [{ productId: items[i].productId, quantity: items[i].quantity }],
                    totalPrice: total,
                    totalItems: TotalItems
                }
                const data = await CartModel.create(newCart);
                return res.status(201).send({ status: true, data: data })
            }
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const updateCart = async (req, res) => {
    try {
        let requestbody = req.body;
        const UserId = req.params.userId
        TokenDetail = req.user

        if (!(validate.isValidObjectId(UserId))) {
            return res.status(400).send({ status: false, message: 'Please provide valid UserId' })
        }

        const userFound = await UserModel.findOne({ _id: UserId })
        if (!userFound) {
            return res.status(404).send({ status: false, message: `User Details not found with given userId` })
        }

        if (TokenDetail.userId != UserId) {
            res.status(401).send({ status: false, message: "userId in url param and in token is not same" })
        }


        if (!(validate.isValidObjectId(requestbody.cartId))) {
            return res.status(400).send({ status: false, message: 'Please provide valid cartId' })
        }

        const findCart = await CartModel.findOne({ _id: requestbody.cartId })
        if (!findCart) {
            return res.status(404).send({ status: false, message: `Cart Details not found with given cartId` })
        }

        if (!(validate.isValidObjectId(requestbody.productId))) {
            return res.status(400).send({ status: false, message: 'Please provide valid Product Id' })
        }

        const ProductFound = await productModel.findOne({ _id: requestbody.productId, isDeleted: false })
        if (!ProductFound) {
            return res.status(404).send({ status: false, message: "Product not found in the cart" });
        }

        if (!(requestbody.removeProduct == 1 || requestbody.removeProduct == 0)) {
            return res.status(404).send({ status: false, message: "removeProduct value should be either 0 or 1." });
        }
     
        if(findCart.items.length<=0)
        {
            return res.status(400).send({ status: false, message: "No Product is available in cart to update" });
        }
        let ProductIndex = findCart.items.findIndex(p => p.productId == requestbody.productId)
        if (ProductIndex > -1) {
            if (requestbody.removeProduct == 0) {
                if(findCart.items[ProductIndex].quantity==0)
                {
                    return res.status(400).send({status:false,message:"Product is not available in db"})
                }
                let DecPrice = (findCart.items[ProductIndex].quantity) * (ProductFound.price)
                findCart.items[ProductIndex].quantity = 0;
                findCart.totalItems = findCart.totalItems - 1;
                findCart.totalPrice = findCart.totalPrice - DecPrice;
                findCart.items.splice(ProductIndex,1)//index,count,add items
                findCart.updatedAt=new Date()
                await findCart.save();
                return res.status(200).send({ status: true, message: "Updated Successfully", data: findCart })
            }
            if (requestbody.removeProduct == 1) {
                if(findCart.items[ProductIndex].quantity==0)
                {
                    return res.status(400).send({status:false,message:"Product is not available in db"})
                }
                findCart.items[ProductIndex].quantity = findCart.items[ProductIndex].quantity - 1;
                findCart.totalPrice = findCart.totalPrice - ProductFound.price;
                if (findCart.items[ProductIndex].quantity == 0) {
                 
                    findCart.totalItems = findCart.totalItems - 1;
                    findCart.items.splice(ProductIndex,1)
                    findCart.updatedAt=new Date()
                    await findCart.save()
                    return res.status(200).send({ status: true, message: "Updated Successfully", data: findCart })
                }
                findCart.updatedAt=new Date()
                await findCart.save();
                return res.status(200).send({ status: true, message: "Updated Successfully", data: findCart })
            }
        } else {
            return res.status(500).send({ status: false, message: "Unmodified Crate. No product found in the Cart" })
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};
const getCart = async (req, res) => {
    try {
        let UserId = req.params.userId;
       let TokenDetail = req.user

        if (!(validate.isValidObjectId(UserId))) {
            return res.status(400).send({ status: false, message: 'Please provide valid UserId' })
        }

        const userFound = await UserModel.findOne({ _id: UserId })
        if (!userFound) {
            return res.status(404).send({ status: false, message: `User Details not found with given userId` })
        }

        if (TokenDetail.userId != UserId) {
            res.status(401).send({ status: false, message: "userId in url param and in token is not same" })
        }

        const CartFound = await CartModel.findOne({ userId: UserId })
        if (!CartFound) {
            return res.status(404).send({ status: false, message: `No Cart found for given User` })
        }

        return res.status(200).send({ status: true, message: "Success", data: CartFound })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
const deleteCart = async (req, res) => {
  /*  try {*/
        let UserId = req.params.userId;
        TokenDetail = req.user
        if (!(validate.isValidObjectId(UserId))) {
            return res.status(400).send({ status: false, message: 'Please provide valid UserId' })
        }

        const userFound = await UserModel.findOne({ _id: UserId })
        if (!userFound) {
            return res.status(404).send({ status: false, message: `User Details not found with given userId` })
        }

        if (TokenDetail.userId != UserId) {
            res.status(401).send({ status: false, message: "userId in url param and in token is not same" })
        }

        const CartFound = await CartModel.findOne({ userId: UserId })
        if (!CartFound) {
            return res.status(404).send({ status: false, message: `No Cart found for given User` })
        }
        let Cart = CartFound.items
        CartFound.totalItems = 0;
        CartFound.totalPrice = 0;
        Cart.splice(0, Cart.length)
        CartFound.updatedAt=new Date();
        await CartFound.save()

        res.status(204).send({ status: true, message: "Success", data: CartFound })
   /* } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }*/
}

module.exports = { createCart,updateCart,getCart,deleteCart}







