const express = require( 'express' );
const router = express.Router();
const {userDetails,verifyUser,resendVerificationEmail,userLogIn,LogOut,allLoginUsers} = require('../Controller/userController');

const {userAuth} = require('../Middleware/auth')

router.post('/signup', userDetails)
router.put('/verify/:id/:token', verifyUser)
router.put('/reverify', resendVerificationEmail)
router.post('/login', userLogIn)
router.put('/logout/:id',LogOut )
router.get('/loginusers', allLoginUsers)


module.exports = router;