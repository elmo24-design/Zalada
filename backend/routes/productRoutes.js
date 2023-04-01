import express from 'express'
const router = express.Router()
//Controllers
import { 
   deleteProduct, 
   getProductById, 
   getProducts, 
   updateProduct, 
   createProduct, 
   createReview,
   getTopProducts
} from '../controllers/productController.js'
import { protect, isAdmin } from '../middleware/authMiddleware.js'

router.route('/')
   .get(getProducts)
   .post(protect, isAdmin, createProduct)
router.route('/top').get(getTopProducts)
router.route('/:id')
   .get(getProductById)
   .delete(protect, isAdmin, deleteProduct)
   .put(protect, isAdmin, updateProduct)
router.route('/:id/reviews').post(protect, createReview)

export default router