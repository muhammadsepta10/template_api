import * as express from "express";
const swaggerUi = require("swagger-ui-express");
import * as specs from "./config/swagger";
import verifyToken from "./middleware/verifyToken"

import allocationController from "./controllers/allocations"
import attachmentsController from "./controllers/attachments"
import authController from "./controllers/auth"
import blacklistController from "./controllers/blacklist"
import couponsController from "./controllers/coupons"
import consumerController from "./controllers/dashboard/consumerData"
import demographicController from "./controllers/dashboard/demographic"
import entriesController from "./controllers/dashboard/entries"
import summaryController from "./controllers/dashboard/summary"
import exportController from "./controllers/export"
import faqsController from "./controllers/faqs"
import masterController from "./controllers/master"
import mobilePulsaController from "./controllers/mobilePulsa"
import periodeController from "./controllers/periode"
import messageController from "./controllers/message"
import prizeController from "./controllers/prize/"
import pushMessageController from "./controllers/pushMessage"
import transactionsController from "./controllers/transactions"
import repliesController from "./controllers/replies"
import usersController from "./controllers/users"
import whitelistController from "./controllers/whitelist"
import winnerController from "./controllers/winner"
import registration from "./controllers/dashboard/registration"
import regSummary from "./controllers/dashboard/regsummary"
import valildasiKtp from "./controllers/validasiKtp"
import generate from "./controllers/generate"

let router = express.Router();
router.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs.specs, { explorer: true })
);

router.get("/", (req, res) => res.send(`WELCOME TO API ${process.env.NAME_PROGRAM}`))
router.use("/api/v1/allocations", verifyToken, allocationController)
router.use("/api/v1/attachments", verifyToken, attachmentsController)
router.use("/api/v1/auth", authController)
router.use("/api/v1/blacklist", verifyToken, blacklistController)
router.use("/api/v1/coupons", verifyToken, couponsController)
router.use("/api/v1/dashboard/consumer", verifyToken, consumerController)
router.use("/api/v1/dashboard/registration", verifyToken, registration)
router.use("/api/v1/dashboard/demographic", verifyToken, demographicController)
router.use("/api/v1/dashboard/entries", verifyToken, entriesController)
router.use("/api/v1/dashboard/summary", verifyToken, summaryController)
router.use("/api/v1/exports", exportController)
router.use("/api/v1/faqs", verifyToken, faqsController)
router.use("/api/v1/master", masterController)
router.use("/api/v1/mobilePulsa", verifyToken, mobilePulsaController)
router.use("/api/v1/message", verifyToken, messageController)
router.use("/api/v1/periode", verifyToken, periodeController)
router.use("/api/v1/prizes", verifyToken, prizeController)
router.use("/api/v1/pushMessage", verifyToken, pushMessageController)
router.use("/api/v1/replies", verifyToken, repliesController)
router.use("/api/v1/users", verifyToken, usersController)
router.use("/api/v1/whitelist", verifyToken, whitelistController)
router.use("/api/v1/transactions", transactionsController)
router.use("/api/v1/winner", verifyToken, winnerController)
router.use("/api/v1/dashboard/regsummary", verifyToken, regSummary)
router.use("/api/v1/ktp", verifyToken, valildasiKtp)
router.use("/api/v1/generate", generate)

export default router