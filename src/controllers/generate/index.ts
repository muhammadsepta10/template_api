import * as express from "express";
import generate from "./generate";

let router = express.Router();


router.route("/").get(generate)

export = router;