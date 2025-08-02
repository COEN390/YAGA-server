import { addProduct, getProducts, removeProduct, 
    getBarcodes, searchByName, getSearchResults } from "../controllers/ProductController.mjs";
import { Router } from "express";

const router = Router()

router.get("/", getProducts)
router.get("/barcodes", getBarcodes)
router.delete("/", removeProduct)
router.post("/", addProduct)
router.post("/search", searchByName)
router.get("/search_results", getSearchResults)

export default router