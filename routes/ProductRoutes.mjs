import { addProduct, getProduct, removeProduct } from "../controllers/ProductController.mjs";
import { Router } from "express";

const router = Router()

router.get("/", getProduct)
router.delete("/", removeProduct)
router.post("/", addProduct)

export default router