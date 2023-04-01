import express from 'express'
const router = express.Router()
import { protect, isAdmin } from '../middleware/authMiddleware.js'
//Controllers
import { 
   authUser, 
   registerUser, 
   getUserProfile, 
   updateUserProfile,
   updateUser,
   getUsers, 
   getUserById,
   deleteUser 
} from '../controllers/userController.js'


router.route('/').post(registerUser).get(protect, isAdmin, getUsers)
router.post('/login', authUser)
router.route('/profile')
   .get(protect, getUserProfile)  //using the protect middleware to get the decoded token and fetch user's details
   .put(protect, updateUserProfile)
router.route('/:id')
   .delete(protect, isAdmin, deleteUser)
   .get(protect, isAdmin, getUserById)
   .put(protect, isAdmin, updateUser)


export default router