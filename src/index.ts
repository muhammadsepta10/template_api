import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import * as expresWinston from "express-winston"
import * as winstonOpt from "./config/winston"
import routes from "./routes";
const app = express()
const port = process.env.PORT
dotenv.config()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(expresWinston.logger(winstonOpt.combineOpt))
app.use("/", routes)
app.use(expresWinston.errorLogger(winstonOpt.errorOpt))
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(500).send({ message: "ERROR!!", data: {} })
})
app.listen(port, () => console.log(`API Connected on Port ${port}`))