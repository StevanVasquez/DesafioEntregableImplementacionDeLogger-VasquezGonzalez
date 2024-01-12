import { Router } from "express";
import { testLogger } from "../controllers/test.controller.js";

const router = Router();

router.get("/", testLogger);

export default router;