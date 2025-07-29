import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        fullname: {
            type: String,
            required: true,


            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,

        },
        password: {
            type: String,
            // Password is required only if the user is NOT a Google user
            required: function () { return !this.isGoogleUser; }
        },
        interests: [{ type: String }],  // Array to store user interests

        role: {
            type: String,
            enum: ['student', 'superadmin', 'admin'],
            default: 'student'
        },


        refreshTokens: {
            type: String
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        isGoogleUser: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }

)
// coustom methods

// for password encryption
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// for password checking 

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// for generate jwt tokens

userSchema.methods.generateAceessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.email,
            fullname: this.fullname
        },

        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },

        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}



export const User = mongoose.model("User", userSchema)

