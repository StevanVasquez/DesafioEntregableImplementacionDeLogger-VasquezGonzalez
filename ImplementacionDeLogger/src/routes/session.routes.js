import { Router } from "express";
import { registerUser, userLogin, userLogout, getCurrentUser } from "../controllers/session.controller.js";
import { passportCall } from "../utils/jwt.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", userLogin);

router.get("/logout", passportCall("jwt"), userLogout);

router.get("/current", passportCall("jwt"), getCurrentUser);

export default router;