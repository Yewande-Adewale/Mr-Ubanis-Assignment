const user=require("../Model/userModel")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const mailSender=require("../Middleware/email")
const dotenv=require("dotenv")
dotenv.config()

//User Registeration
exports.userDetails = async (req, res)=>{
    try{
    const{username,email,password}=req.body
    const checkEmail = await usermodel.findOne({email})
        if(checkEmail){
        res.status(500).json({
       message:"email already exist."
            })

        }else{
    const salt=bcrypt.genSaltSync(10)
     const hashedPassword=bcrypt.hashSync(password,salt)
     const data={
         username,
         email,
         password:hashedPassword,
         token: token
    };


      const createduser=await user.create(data)
      const token=jwt.sign(
    {
       id:createduser._id,
       email:createduser.email
      },process.env.secretkey,{expiresIn:300})

    
     createduser.token=token
     const subject="PLEASE VERIFY"
     const link=`${req.protocol}://${req.get("host")}/userverify/${createduser._id}/${token}`
     const message=` Welcome onboard, kindly  use this link ${ link} to verify your acct, kindly note that this link will expire after five(5) minutes`
     mailSender({
          email:createduser.email,
          subject,
          message 
    })
    const savedUser = await createUser.save()
    if (!savedUser) {
        res.status(400).json({
            message: 'Failed to Create Account'
        })
    } else {
        res.status(201).json({
            message: 'Successfully created account',
            data: savedUser
        });
    }
   }

  }catch(error) {
   res.status(500).json({
    message: error.message
  })
  }
}

//User Email Verification
exports.verifyUser=async(req,res)=>{

    try {
      const registeredUser=await user.findById(req.params.id)
      const registeredToken=registeredUser.token
     const userVerified= await jwt.verify(registeredToken,process.env.secretkey,(err,data)=>{
        if(err){res.json("This link has expired,resend another email verification")}
        else{
          return data
        }
      })
  
  
    const verified=await user.findByIdAndUpdate(req.params.id,{isVerified:true})
    if(!verified){
      res.json("Unable to verify this account")
    }
    else{
      res.json(`user ${verified.email} has been verifed`)
    }
  }
    
   catch (error) {
   error.message
  }
  }

  //User Resend Email Verification
  exports.resendVerificationEmail = async(req, res)=>{
    try {
        const { email } = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            })
        }else {
            const verified = await userModel.findByIdAndUpdate(user._id, {isVerified: true})
            const token = await jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '5m'});
            await jwt.verify(token, process.env.JWT_SECRET, (err)=>{
                if(err) {
                    res.json('This Link is Expired. Please try again')
                } else {   
                    if (!verified) {
                        res.status(404).json({
                            message: 'User is not verified yet'
                        })
                    } else {
                        const subject = 'Kindly RE-VERIFY'
                        const link = `${req.protocol}://${req.get('host')}/api/verify/${user._id}/${token}`
                        const message = `Welcome onBoard, kindly use this link ${link} to re-verify your account. Kindly note that this link will expire after 5(five) Minutes.`
                        emailSender({
                            email: user.email,
                            subject,
                            message
                        });
                        res.status(200).json({
                            message: `Verification email sent successfully to your email: ${user.email}`
                        })
                    }
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//User Login
exports.userLogIn = async(req, res)=>{
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            });
        } else {
            if(!user.isVerified) {
                res.status(400).json({
                    message: 'User not verified'
                })
            } else {
                const isPassword = await bcrypt.compare(password, user.password);
                if(!isPassword) {
                    res.status(400).json({
                        message: 'Incorrect Password'
                    });
                } else {
                    const userLogout = await userModel.findByIdAndUpdate(user._id, {islogin: true});
                    const token = await genToken(user);
                    res.status(200).json({
                        message: 'Log in Successful',
                        token: token
                    });
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


// User LogOut
exports.LogOut = async(req, res)=>{
    try {
        const { id } = req.params;
        token = ' ';
        const userLogout = await userModel.findByIdAndUpdate(id, {token: token}, {islogin: false});
        const logout = await userModel.findByIdAndUpdate(id, {islogin: false});
        // userLogout.token = ' ';
        // user.islogin = false;
        if(!userLogout) {
            res.status(400).json({
                message: 'User not logged out'
            })
        } else {
            res.status(200).json({
                message: 'User Successfully logged out',
                data: userLogout
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

//All Logged In 
exports.allLoginUsers = async (req, res)=>{
    try {
        const loginUsers = await userModel.findAll({islogin: true})
        if (loginUsers.length == 0) {
            res.status(404).json({
                message: 'No Login Users at the Moment'
            })
        } else {
            res.status(200).json({
                message: 'All Login Users',
                data: loginUsers
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}




const genToken = async(user)=>{
    const token = await jwt.sign({
        userId: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET, {expiresIn: '5m'})
    return token
};


