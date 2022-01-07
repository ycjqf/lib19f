import express from "express";
import accountLogin from "@/api/accountLogin";
import accountRegister from "@/api/accountRegister";

const router = express.Router();

router.use("/api/account/register", accountRegister);
router.use("/api/account/login", accountLogin);

export default router;
