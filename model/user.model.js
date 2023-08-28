import mongoose from "mongoose";
const NewUserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            require: true,
        },
        lastName: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true

        },
        referralCount: {
            type: Number,
            default: 0,
        },
        referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        totalReferralBonus:{
            type:String,
            
        },
        referralCode: {
            type: String,
        },
        tokenBalance: {
            type: Number,
            default: 100,

        }

    }
)

const User = mongoose.model('newuser', NewUserSchema);
export default User;