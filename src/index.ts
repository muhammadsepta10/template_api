import express from "express"
import cors, { CorsOptions } from "cors"
import dotenv from "dotenv"
import * as expresWinston from "express-winston"
import * as winstonOpt from "./config/winston"
import routes from "./routes";
import { checkOrigin } from "./controllers/dashboard/entries/model"
const app = express()
const port = process.env.PORT
dotenv.config()
let origins: string[] = []
checkOrigin().then((resp) => {
    for (let i = 0; i < resp.length; i++) { origins.push(resp[i].origin) }
})
const corsOptions: CorsOptions = {
    origin: async (origin: any, callback: any) => {
        if (!origin) {
            callback(null, true)
        } else if (origins.indexOf(origin) >= 0) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))
app.use(expresWinston.logger(winstonOpt.combineOpt))
app.use("/", routes)
app.use(expresWinston.errorLogger(winstonOpt.errorOpt))
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(500).send({ message: "ERROR!!", data: {} })
})
app.listen(port, () => console.log(`API Connected on Port ${port}`))