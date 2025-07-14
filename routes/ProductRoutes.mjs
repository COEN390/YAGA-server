import { addProduct, getProduct } from "../controllers/ProductController.mjs";
import { Router } from "express";

const router = Router()

router.get("/", getProduct)
router.post("/", addProduct)

export default router