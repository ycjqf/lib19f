import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  return res.end("article uploaded");
});

export default router;
