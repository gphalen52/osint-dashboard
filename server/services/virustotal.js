import { Router } from "express";
import { lookupVirusTotal } from "../services/virustotal.js";

const router = Router();

router.get("/:domain", async (req, res) => {
  const { domain } = req.params;

  try {
    const result = await lookupVirusTotal(domain);
    const statusCode = result.status === "error" ? 502 : 200;
    res.status(statusCode).json(result);
  } catch (err) {
    res.status(502).json({
      source: "virustotal",
      status: "error",
      error: err.message,
    });
  }
});

export default router;