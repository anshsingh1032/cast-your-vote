import express ,{json} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(express.json({
    limit:"16kb"
}))
app.use(cors({
    origin: 'http://localhost:5174', 
    credentials: true
}))
app.use(express.urlencoded({
    extended:true,limit:"16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from "./routes/user.routes.js"
import candidateRouter from "./routes/candidates.routes.js"
app.use("/api/v1/users",userRouter)
app.use("/api/v1/candidates",candidateRouter)

export{app}