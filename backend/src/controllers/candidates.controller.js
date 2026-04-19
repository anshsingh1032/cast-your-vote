import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Candidate } from "../models/candidates.model.js";
import { User } from "../models/user.model.js";

const checkRole = async function(userId) {
    try {
        const user = await User.findById(userId)
        if(user.role === "admin"){
            return true;
        }
    } catch (error) {
        return false
    }
}

const registerCandidate = asyncHandler(async(req,res)=>{
    if (!(await checkRole(req.user._id))) 
        throw new ApiError(403,"not an admin")

    const {name,party,age,votes,voteCount}=req.body

    if(!name||!age||!party)
    {
        throw new ApiError(400,"all fields are required")
    }

    const existedCandidate = await Candidate.findOne({ name, party })

    if(existedCandidate){
        throw new ApiError(409,"candidate already existed");    
    }
    const candidate = await Candidate.create({
        name,
        age,
        party,
        votes:votes||[],
        voteCount
    })
    const accessToken = candidate.generateAccessToken()
    const createdCandidate = await Candidate.findById(candidate._id)
    return res.status(201).json(
        new ApiResponse(200,{candidate:createdCandidate,accessToken},"candidate registered successfully")
    )

})

const updateCandidate = asyncHandler(async(req,res)=>{
    if(!await checkRole(req.user._id))
        throw new ApiError(403,"not an admin")
    const candidateId  = req.params.candidateId
    const {name,party,age} = req.body
    if (!name||!party||!age) {
        throw new ApiError(400,"All fields are required")
    }

    const candidate = await Candidate.findByIdAndUpdate(candidateId,
        {
            $set:{
                name,
                party,
                age,
            }
        },{new:true}
    )
    if (!candidate) throw new ApiError(400,"candidate not found")
    
    return res
    .status(200)
    .json(new ApiResponse(200,candidate,"candidate data updated successfully"))
})
const deleteCandidate = asyncHandler(async(req,res)=>{
    if(!await checkRole(req.user._id))
        throw new ApiError(403,"not an admin")
    const candidateId  = req.params.candidateId
    const candidate = await Candidate.findByIdAndDelete(candidateId)
    return res
    .status(200)
    .json(new ApiResponse(200,candidate,"candidate data deleted successfully"))
})
const getVote = asyncHandler(async(req,res)=>{
    console.log("Vote route hit");

    const candidateId = req.params.candidateId;
    const userId = req.user._id;
    
    const candidate = await Candidate.findById(candidateId);
    if(!candidate) throw new ApiError(400,"candidate not found");
    
    const user = await User.findById(userId);
    if(!user) throw new ApiError(400,"user not found");

    if(user.role=="admin") return res
    .status(403)
    .json(new ApiResponse(403,"admin is not allowed to vote"))
    if(user.isVoted) throw new ApiError(400,"a user can vote only one time");

    candidate.votes.push({user:userId});
    candidate.voteCount++;
    await candidate.save();

    user.isVoted=true
    await user.save();

    return res.status(200).json(
    new ApiResponse(200, "vote recorded successfully"))
     
})
const voteCount = asyncHandler(async(req,res)=>{
    const candidate = await Candidate.find().sort({voteCount:"desc"});
    const voteRecord= candidate.map((data)=>{
        return{
            party:data.party,
            voteCount:data.voteCount
        }
    })
    return res.status(200).json(
    new ApiResponse(200, voteRecord)
)
})
const listOfCandidates = asyncHandler(async(req,res)=>{
    const candidates =await Candidate.find().select(" -votes -createdAt -updatedAt -__v -voteCount");
    return res.status(200).json(
    new ApiResponse(200, candidates))
})
export {
    registerCandidate,
    updateCandidate,
    deleteCandidate,
    getVote,
    voteCount,
    listOfCandidates
}