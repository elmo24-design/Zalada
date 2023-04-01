import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

//@desc     Fetch all products
//@route    GET /api/products
//@access   Public route
const getProducts = asyncHandler(async (req, res) => {
   const pageSize = 10
   const page = Number(req.query.pageNumber) || 1

   const keyword = req.query.keyword ? {
      name:{
         $regex: req.query.keyword, //To get not only the exact name, but per characters
         $options: 'i' //means case insensitive
      }
   } : {}

   const count = await Product.countDocuments({ ...keyword })
   const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))

   res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

//@desc     Fetch single product
//@route    GET /api/products/:id
//@access   Public route
const getProductById = asyncHandler(async (req, res) => {
   const product = await Product.findById(req.params.id)

   if(product){
      res.json(product)
   }else{
      res.status(404)
      throw new Error('Product not found')
   }
})


//@desc     Delete a product
//@route    DELETE /api/products/:id
//@access   Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
   const product = await Product.findById(req.params.id)

   if(product){
      await product.remove()

      res.json({ message: 'Product removed'})
   }else{
      res.status(404)
      throw new Error('Product not found')
   }
})

//@desc     Create a product
//@route    POST /api/products
//@access   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
   const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample Category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample Description'
   })

   const createdProduct = await product.save()
   res.status(201).json(createdProduct)
})

//@desc     Update a product
//@route    PUT /api/products/:id
//@access   Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
   const { name, price, description, image, brand, category, countInStock } = req.body 

   const product = await Product.findById(req.params.id)

   if(product){
      if(name)product.name = name
      if(price)product.price = price
      if(description)product.description = description
      if(image)product.image = image
      if(brand)product.brand = brand
      if(category)product.category = category
      if(countInStock)product.countInStock = countInStock

      const updatedProduct = await product.save()
      res.json(updatedProduct)
   }else{
      res.status(404)
      throw new Error('Product not found')
   }
})

//@desc     Create new review
//@route    POST /api/products/:id/reviews
//@access   Private
const createReview = asyncHandler(async (req, res) => {
   const { rating, comment } = req.body 

   const product = await Product.findById(req.params.id)

   if(product){
      const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

      if(alreadyReviewed){
         res.status(400)
         throw new Error('Product already reviewed')
      }

      const review  = {
         name: req.user.name,
         rating: Number(rating),
         comment: comment,
         user: req.user._id
      }

      product.reviews.push(review)

      product.numReviews = product.reviews.length

      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / 
      product.reviews.length

      await product.save()
      res.status(201).json({ message: 'Review added'})
   }else{
      res.status(404)
      throw new Error('Product not found')
   }
})

//@desc     Get top rated products
//@route    GET /api/products/top
//@access   Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3) //-1 = ascending order

  res.json(products)
})

export {
   getProducts, 
   getProductById, 
   deleteProduct,
   createProduct,
   updateProduct,
   createReview,
   getTopProducts
}