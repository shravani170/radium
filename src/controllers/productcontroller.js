const mongoose = require('mongoose')
const multer = require('multer')
const validate = require("../Util/Validation")
const Uploading = require("../Util/S3Uploading")
const currencySymbol = require("currency-symbol-map")

const productModel = require('../models/productModel')
const createProduct = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!validate.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid params received in request body' })
        }

        let { title, description, price, currencyId, isFreeShipping, style, availableSizes, installments } = requestBody;

        if (!validate.isValid(title)) {
            return res.status(400).send({ status: false, message: 'Title is required' })
        }

        const isTitleAlreadyUsed = await productModel.findOne({ title });

        if (isTitleAlreadyUsed) {
            return res.status(400).send({ status: false, message: 'Title is already used.' })
        }

        if (!validate.isValid(description)) {
            return res.status(400).send({ status: false, message: 'Description is required' })
        }

        if (!validate.isValid(price)) {
            return res.status(400).send({ status: false, message: 'Price is required' })
        }

        if (!(!isNaN(Number(price)))) {
            return res.status(400).send({ status: false, message: `Price should be a valid number` })
        }
        if (price <= 0) {
            return res.status(400).send({ status: false, message: `Price should be a valid number` })
        }

        if (!validate.isValid(currencyId)) {
            return res.status(400).send({ status: false, message: 'CurrencyId is required' })
        }

        if (!(currencyId == "INR")) {
            return res.status(400).send({ status: false, message: 'currencyId should be a INR' })
        }


        if (installments) {
            if (!(!isNaN(Number(installments)))) {
                return res.status(400).send({ status: false, message: `Installments should be a valid number` })
            }
        }

        if (validate.isValid(isFreeShipping)) {

            if (!((isFreeShipping === "true") || (isFreeShipping === "false"))) {
                return res.status(400).send({ status: false, message: 'isFreeShipping should be a boolean value' })
            }
        }


        let downloadUrl;
        let productImage = req.files;
        if (!(productImage && productImage.length > 0)) {
            return res.status(400).send({ status: false, msg: "productImage is required" });
        }

        //upload to s3 and return true..incase of error in uploading this will goto catch block( as rejected promise)
        downloadUrl = await Uploading.uploadFile(productImage[0]); // expect this function to take file as input and give url of uploaded file as output 
        //   res.status(201).send({ status: true, data: uploadedFileURL });
        //console.log("urllllll", downloadUrl)



        if (!validate.isValid(availableSizes)) {
            return res.status(400).send({ status: false, message: 'availableSizes is required' })
        }

        let Check = availableSizes.split(",")
        for (i = 0; i < Check.length; i++) {
            let size = ["S", "XS", "M", "X", "L", "XXL", "XL"]
            if (!(size.includes(Check[i]))) {
                return res.status(400).send({ status: false, message: `availableSizes should be among S, XS, M, X, L, XXL, XL ` })
            }
        }
        availableSizes =  Check


        var productData = {
            title,
            description,
            price,
            currencyId,
            currencyFormat: currencySymbol('INR'),
            isFreeShipping,
            style,
            installments,
            productImage: downloadUrl,
            availableSizes
        }
       




        const newProduct = await productModel.create(productData)
        res.status(201).send({ status: true, message: "Success", data: newProduct })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, data: error });
    }
}
////////////////////////////
const getAllProducts = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false }
        const queryParams = req.query;

        if (validate.isValidRequestBody(queryParams)) {
            const { size, name, priceGreaterThan, priceLessThan, priceSort} = queryParams;


            if (validate.isValid(size)) {
                filterQuery['availableSizes'] = size
            }

            if (validate.isValid(name)) {
                filterQuery['title'] = {}
                filterQuery['title']['$regex'] = name//titlt is mapped with name coz name we have to give in input +regex is usedto match exact field
       
            }

            if (validate.isValid(priceGreaterThan)) {

                if (!(!isNaN(Number(priceGreaterThan)))) {
                    return res.status(400).send({ status: false, message: `priceGreaterThan should be a valid number` })
                }
                if (priceGreaterThan <= 0) {
                    return res.status(400).send({ status: false, message: `priceGreaterThan should be a valid number` })
                }
                if (!Object.prototype.hasOwnProperty.call(filterQuery, 'price'))
                    filterQuery['price'] = {}
                filterQuery['price']['$gte'] = Number(priceGreaterThan)
               // console.log(typeof Number(priceGreaterThan))
            }

            if (validate.isValid(priceLessThan)) {

                if (!(!isNaN(Number(priceLessThan)))) {
                    return res.status(400).send({ status: false, message: `priceLessThan should be a valid number` })
                }
                if (priceLessThan <= 0) {
                    return res.status(400).send({ status: false, message: `priceLessThan should be a valid number` })
                }
                if (!Object.prototype.hasOwnProperty.call(filterQuery, 'price'))
                    filterQuery['price'] = {}
                filterQuery['price']['$lte'] = Number(priceLessThan)
               // console.log(typeof Number(priceLessThan))
            }

            if (validate.isValid(priceSort)) {

                if (!((priceSort == 1) || (priceSort == -1))) {
                    return res.status(400).send({ status: false, message: `priceSort should be 1 or -1 ` })
                }
    
                    const products = await productModel.find(filterQuery).sort({ price: priceSort })
    
                    if (Array.isArray(products) && products.length === 0) {
                        return res.status(404).send({ statuproductss: false, message: 'No Product found' })
                    }
    
                    return res.status(200).send({ status: true, message: 'Product list', data: products })
            }
        }

        const products = await productModel.find(filterQuery)

        if (Array.isArray(products) && products.length === 0) {
            return res.status(404).send({ statuproductss: false, message: 'No Product found' })
        }

        return res.status(200).send({ status: true, message: 'Product list', data: products })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
   
const getProductDetails = async function (req, res) {
    try {
        const productId = req.params.productId

        if (!validate.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: `${productId} is not a valid product id` })
        }

        const product = await productModel.findOne({ _id: productId, isDeleted: false });

        if (!product) {
            return res.status(404).send({ status: false, message: `product does not exit` })
        }

        return res.status(200).send({ status: true, message: 'Success', data: product })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const updateProduct=async function (req, res) 
{
    try {
    const reqProductId=req.params.productId
    let productImage = req.files;
    let updateBody = req.body

    if (!validate.isValidRequestBody(updateBody)) 
    
    {
    if(!(productImage))
    {
        
        return res.status(400).send({ status: false, message: "Please provide data to proceed your update request" });
    }
    if(!(productImage.length > 0))
    {
        return res.status(400).send({ status: false, message: "Please provide productImage or productImage field" });
    }
    
    }
  
    const {title, description, price,isFreeShipping,style,availableSizes} = updateBody
        if (!validate.isString(title))
        {
            return res.status(400).send({ status: false, message: "Please provide title or title field" });
        }
        if (!validate.isString(description))
        {
            return res.status(400).send({ status: false, message: "Please provide description or description field" });
        }
        if (!validate.isString(price))
        {
            return res.status(400).send({ status: false, message: "Please provide price or price field" });
        }
        if (!validate.isString(isFreeShipping))
        {
            return res.status(400).send({ status: false, message: "Please provide isFreeShipping or isFreeShipping field" });
        }
    
        if (!validate.isString(style))
        {
            return res.status(400).send({ status: false, message: "Please provide style or style field" });
        }
        if (!validate.isString(availableSizes))
        {
            return res.status(400).send({ status: false, message: "Please provide availableSizes or availableSizes field" });
        }
        if (productImage && productImage.length > 0) 
        {
            var uploadedFileURL = await Uploading.uploadFile(productImage[0]);
            updateBody.productImage = uploadedFileURL
        }
      
    let checkProductId = await productModel.findOne({ _id: reqProductId})
    if(!checkProductId)
    {
        return res.status(404).send({ status: false, message: "Product Id doesn't exist" });
    }
    if (checkProductId.isDeleted == true) { 
        return res.status(404).send({ status: false, message: "This Product is no longer exists" });
    }
    if (title) {
        checkProductId.title = title;//description, price,isFreeShipping,productImage,style,availableSizes
    }
    if (description) {
        checkProductId.description = description;
    }
    if (price) {
        checkProductId.price =  price;
    }
    if (isFreeShipping) {
        checkProductId.isFreeShipping = isFreeShipping;
    }
  
    if (style) {
        checkProductId.style = style;
    }

    if (availableSizes) {//only one size at a time
        checkProductId.availableSizes = availableSizes.toUpperCase();
    }
  //  checkProductId.save();
    const UpdateData = {title,description,price,isFreeShipping,productImage:uploadedFileURL,style,availableSizes}
    const updatedProduct = await productModel.findOneAndUpdate({ _id:reqProductId }, UpdateData, { new: true })
    return res.status(200).send({ status: true, message: 'Product Details Updated', data:updatedProduct});
    } 
    catch (err) 
    {
        return res.status(500).send({ message: err.message });
    }
    
}
const deleteProduct = async function (req, res) {
    try {
        const params = req.params
        const productId = params.productId

        if (!validate.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: `${productId} is not a valid product id` })
        }

        const product = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!product) {
            return res.status(404).send({ status: false, message: `product not found` })
        }

        await productModel.findOneAndUpdate({ _id: productId }, { $set: { isDeleted: true, deletedAt: new Date() } })
        return res.status(200).send({ status: true, message: `Success` })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}








module.exports.createProduct = createProduct
module.exports.getAllProducts = getAllProducts
module.exports.getProductDetails = getProductDetails
module.exports.updateProduct = updateProduct
module.exports.deleteProduct=deleteProduct