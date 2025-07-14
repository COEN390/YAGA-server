import express from "express"
import productRoutes from "./routes/ProductRoutes.mjs"
import bodyparser from "body-parser"

/////////////////////////////////////////////////////////////////////////////////////////////////////////
const app = express()
const port = 3000


app.use(bodyparser.json())

/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use("/api/product", productRoutes)



app.listen(port,'0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})
