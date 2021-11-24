const orderModel = require('../models/OrderModels')
const userModel = require('../models/userDocument')
const productModel = require('../models/prouductDocument')

const mongoose = require("mongoose")

// const createOrder = async function (req, res) {
//     // user validation
//     let userId = req.body.userId
//     let productId = req.body.productId
//     //let appHeaderType = req.headers['isfreeapp']
//     let appTypeFree = req.isFreeAppUser//This attribute was set in the appMiddleware
//     let orderAmount
//     let orderDate = Date()
//     // if(appHeaderType === 'false') {
//     //     appTypeFree = false
//     // } else {
//     //     appTypeFree = true
//     // }

//     let user = await userModel.findById(userId)
//     console.log(user)
//     if(!user) {
//         return res.send({message: "User doesn't exist. Please provide a valid userId"})
//     }

//     //product validation
//     let product  = await productModel.findById(productId)
//     if(!product) {
//         return res.send({message: "Product doesn't exist. Please provide a valid productId"})
//     }

//     //user balance validation
//     if(!appTypeFree && user.balance < product.price) {
//         return res.send({message: "User doesn't have enough balance to purchase the product"})
//     }

//     if(appTypeFree) {
//         orderAmount = 0
//     } else {
//         //paid app
//         orderAmount = product.price
//     }

//     let orderDetails = {
//         userId: userId,
//         productId: productId,
//         amount: orderAmount,
//         isFreeAppUser: appTypeFree, 
//         date: orderDate
//     }

//     let orderCreated = awat(orderDetails)t orderModel.c
    
//    if(!appTypeFree) {
//        await userModel.findOneAndUpdate({_id: userId}, {balance: user.balance - product.price})
//    }

//    res.send({data: orderCreated})

    // const createOrder = async function (req, res) {
    // let data = req.body
    // let value = req.isFreeAppUser
    // let checkuserid = await userModel.findById(data.userId)
    // let checkproductid = await productModel.findById(data.productId)
    // if (checkuserid && checkproductid) {
    //     if (value == true) {
    //         let savedData = await Orderdoc.create(data)
    //         res.send({ msg: savedData })
    //     }
    //     else if (value == false) {
    //         if (checkuserid.balance >= checkproductid.price) {
    //             leftuserbalance = checkuserid.balance - checkproductid.price;
    //             data.amount = checkproductid.price;
    //             let saVEDdata = await userModel.findOneAndUpdate(checkuserid, { balance: leftuserbalance }, { new: true })
    //             let savedDatA = await prouductDocument.create(data)
    //             res.send({ msg: savedDatA })
    //         }
    //         else {
    //             res.send("Insufficient balance user have")
    //         }
    //     }
    // }
    // else {
    //     res.send("No id matches with this")
    // }
//}
const createOrder = async function (req, res) {
var orderdata = req.body
let IdOfUser = req.body.userId
let IdOfProduct = req.body.productId
let userBalance = await userModel.findOne({ _id: IdOfUser })
let productPrice = await productModel.findOne({ _id: IdOfProduct })
if (req.headers.isfreeapp == "false"){
    if(userBalance.balance >= productPrice.price){
        let orderCreated = await orderModel.create(orderdata)
        let orderUpdated = await orderModel.findOneAndUpdate({ _id: orderCreated._id},{$set: {amount: productPrice.price, isFreeAppUser: false}},{new: true}) 
        let remainingBalance = userBalance.balance-productPrice.price
        let updatedBalance = await userModel.findOneAndUpdate({ _id: IdOfUser }, {balance: remainingBalance},{new:true})         
        res.send({data: orderUpdated, userBalance: updatedBalance.balance})
    } else { res.send({data: "insufficient balance to place order"}) }
} else {
    let savedOrderData = await orderModel.create(orderdata)
    let freeOrder = await orderModel.findOneAndUpdate({ _id: savedOrderData._id},{$set: {amount: 0, isFreeAppUser: true}},{new: true})
    res.send({data: freeOrder, userBalance: userBalance.balance})
}

}

module.exports.createOrder = createOrder