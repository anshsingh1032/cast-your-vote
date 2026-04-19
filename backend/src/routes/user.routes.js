import { Router } from "express";
import {registerUser,loginUser,getCurrentUser,changeCurrentPassword} from "../controllers/user.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/profile").get(verifyJwt,getCurrentUser)
router.route("/profile/password").put(verifyJwt,changeCurrentPassword)

export default router