import { addProduct, getProducts, removeProduct, getBarcodes } from "../controllers/ProductController.mjs";
import { Router } from "express";

const router = Router()

router.get("/", getProducts)
router.get("/barcodes", getBarcodes)
router.delete("/", removeProduct)
router.post("/", addProduct)

export default router