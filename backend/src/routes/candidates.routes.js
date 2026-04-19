import { Router } from "express";
import { registerCandidate, updateCandidate, deleteCandidate , getVote,voteCount,listOfCandidates} from "../controllers/candidates.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(verifyJwt,registerCandidate)
router.route("/:candidateId").put(verifyJwt, updateCandidate)
router.route("/:candidateId").delete(verifyJwt, deleteCandidate)
router.route("/vote/count").get(voteCount)
router.route("/vote/:candidateId").post(verifyJwt, getVote)
router.route("/").get(listOfCandidates)

export default router