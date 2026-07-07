import { Router } from "express";
import { lookupShodan } from "../services/shodan.js";

const router = Router();

router.get("/:ip", async (req, res) => {
  const { ip } = req.params;

  try {
    const result = await lookupShodan(ip);
    const statusCode = result.status === "error" ? 502 : 200;
    res.status(statusCode).json(result);
  } catch (err) {
    res.status(502).json({
      source: "shodan",
      status: "error",
      error: err.message,
    });
  }
});

export default router;
