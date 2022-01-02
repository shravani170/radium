const express = require('express');

const router = express.Router();

const USERController=require("../controllers/Usercontroller")
const Middleware=require("../middleware/Authentication")
const productController=require('../controllers/productController')
const cartController=require('../controllers/cartController')
const orderController=require('../controllers/orderController')

router.post('/register',USERController.createUser)
router.post('/login',USERController.loginUser)
router.get('/user/:userId/profile',Middleware.Auth,USERController.getUserDetails)
router.put('/user/:userId/profile',Middleware.Auth,USERController.UpdateUser)


//product routs
router.post('/products', productController.createProduct)
router.get('/products', productController.getAllProducts)
router.get('/products/:productId', productController.getProductDetails)
router.put('/products/:productId', productController.updateProduct)
router.delete('/products/:productId', productController.deleteProduct)

// cart routes
router.post('/users/:userId/cart',Middleware.Auth,cartController.createCart)
router.put('/users/:userId/cart',Middleware.Auth,cartController.updateCart)
router.get('/users/:userId/cart',Middleware.Auth,cartController.getCart)
router.delete('/users/:userId/cart',Middleware.Auth,cartController.deleteCart)
//order routes
router.post('/users/:userId/orders',Middleware.Auth,orderController.createOrder)
router.put('/users/:userId/orders',Middleware.Auth,orderController.updateOrder)


module.exports = router;