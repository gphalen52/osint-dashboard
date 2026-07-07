import { Router } from "express";
import { lookupCrtSh } from "../services/crtsh.js";

const router = Router();

router.get("/:domain", async (req, res) => {
  const { domain } = req.params;

  try {
    const result = await lookupCrtSh(domain);
    res.json(result);
  } catch (err) {
    res.status(502).json({
      source: "crt.sh",
      status: "error",
      error: err.message,
    });
  }
});

export default router;
