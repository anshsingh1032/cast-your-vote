import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
const candidateSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        party:{
            type:String,
            required:true
        },
        age:{
            type:String,
            required:true
        },
        votes:[
            {
                user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User",
                    required:true
                },
                votedAt:{
                    type:Date,
                    default:Date.now()
                }
            }
        ],
        voteCount:{
            type:Number,
            default:0
        }
    }
,{timestamps:true})

candidateSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id:this._id,
        },process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const Candidate = mongoose.model("Candidate",candidateSchema)