const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required:true
    },

    email: {
        type: String,
        required:true,
        unique:true
    },

    password: {
        type: String,
        required:true
    },

    token: {
        type:String
    },

    isVerified: {
        type:Boolean,
        default:false
    },

    islogin: {
        type: Boolean,
        default:false
    },

    isAdmin: {
        type: Boolean,
        default:false
    },
    
    isSuperAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const userModel = mongoose.model('userInfo', userSchema);
module.exports = userModel