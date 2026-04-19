import jwt from "jsonwebtoken"

// export const verifyJwt = asyncHandler(async(req,_,next)=>{
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
//         if(!token){
//             throw new ApiError(401,"Unauthorized request")
//         }
//         const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
//         if (!user) {
//             throw new ApiError(401,"Invalid Access Token")
//         }
//         req.user = user
//         next()
//     } catch (error) {
//         throw new ApiError(401,error?.message || "Invalid Access Token")
//     }
// })
export const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;  // Attach user info to req
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};