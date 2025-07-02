import express from 'express'
import { register, logout, login } from '../controller/authController.js';


const router = express.Router();


router.route('/register')
   .post(register); // Register a new user

   router.route('/login')
   .post(login); // login a new user

router.route('/logout')
  .get(logout); // logout user


export default router
