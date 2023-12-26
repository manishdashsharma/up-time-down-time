import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import routes from "./routes/index.js"
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs';

const filePath = new URL('../swagger.json', import.meta.url);
const swaggerDocument = JSON.parse(readFileSync(filePath));

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())


app.use("/api/v1/", routes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "If you are seeing this then, server is !down"
    })
})

app.all("*", (_req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    })
})
export default app;