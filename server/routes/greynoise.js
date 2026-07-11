import { Router } from "express";
import { lookupGreyNoise } from "../services/greynoise.js";

const router = Router();

router.get("/:ip", async (req, res) => {
  const { ip } = req.params;

  try {
    const result = await lookupGreyNoise(ip);
    const statusCode = result.status === "error" ? 502 : 200;
    res.status(statusCode).json(result);
  } catch (err) {
    res.status(502).json({
      source: "greynoise",
      status: "error",
      error: err.message,
    });
  }
});

export default router;