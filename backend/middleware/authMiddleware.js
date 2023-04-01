import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async(req, res, next) => {
   let token 

   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      try{
         token = req.headers.authorization.split(' ')[1] //getting the token

         const decoded = jwt.verify(token, process.env.JWT_SECRET) //decoding the token

         console.log(decoded)

         req.user = await User.findById(decoded.id).select('-password') //Fetch the user details from the jwt decoded token then assign it to req.user

         next()
      }catch(err){
         console.error(err)
         res.status(401)
         throw new Error('Not authorized, token failed')
      }
   }

   if(!token){
      res.status(401)
      throw new Error('Not authorized, no token')
   }
})

const isAdmin = (req, res, next) => {
   if(req.user && req.user.isAdmin){ //Check if there's a logged in user and the logged in user is an admin
      next()
   }else{
      res.status(401)
      throw new Error('Not authorized as an admin')
   }
}

export { protect, isAdmin }