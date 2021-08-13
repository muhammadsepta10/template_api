import * as express from "express";
import * as transactions from "./transactions";
import { upload } from '../../middleware/upload';
import verifyToken from "../../middleware/verifyToken"

let router = express.Router();

/**
 * @swagger
 *
 * components:
 *  schemas:
 *      updateTransaction:
 *          type: object
 *          required:
 *              - winnerId
 *              - accountNumber
 *          properties:
 *              winnerId:
 *                  example: 2
 *                  type: number
 *              accountNumber:
 *                  example: 085967025385
 *                  type: string
 *      importTransactions:
 *          type: object
 *          required:
 *              - file
 *          properties:
 *              file:
 *                  type: file

 *
 *
 */

/**
 * @swagger
 * /api/v1/transactions?row={row}&page={page}&order={order}&orderCondition={orderCondition}&key={key}&type={type}&status={status}&startDate={startDate}&endDate={endDate}:
 *      get:
 *          tags:
 *              - Transactions
 *          summary: list transactions
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: row
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: page
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: order
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *              - name: orderCondition
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *              - name: key
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *              - name: type
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: status
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: startDate
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *              - name: endDate
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *
 *          responses:
 *             200:
 *                  description: Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Get Data Success
 *                                  success:
 *                                      example: 1
 *                                      type: boolean
 *                                  status:
 *                                      example: 200
 *                                      type: string
 *                                  data:
 *                                      type: object
 *             422:
 *                  description: Invalid
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Get Data Failed
 *                                  success:
 *                                      example: 0
 *                                      type: boolean
 *                                  status:
 *                                      example: 422
 *                                      type: string
 *                                  data:
 *                                      type: object
 */
router.route("/").get(verifyToken, transactions.listTransactions);

/**
 * @swagger
 * /api/v1/transactions/{id}:
 *      get:
 *          tags:
 *              - Transactions
 *          summary: list transactions
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *          responses:
 *             200:
 *                  description: Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Get Data Success
 *                                  success:
 *                                      example: 1
 *                                      type: boolean
 *                                  status:
 *                                      example: 200
 *                                      type: string
 *                                  data:
 *                                      type: object
 *             422:
 *                  description: Invalid
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Get Data Failed
 *                                  success:
 *                                      example: 0
 *                                      type: boolean
 *                                  status:
 *                                      example: 422
 *                                      type: string
 *                                  data:
 *                                      type: object
 */
router.route("/:id").get(verifyToken, transactions.transactionByid);

/**
 * @swagger
 * /api/v1/transactions/update:
 *      put:
 *          tags:
 *              - Transactions
 *          summary: update transactions
 *          security:
 *              - ApiKeyAuth: []
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: update transactions
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/updateTransaction'
 *          responses:
 *             200:
 *                  description: Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Success
 *                                  token:
 *                                      example: varchar
 *                                      type: varchar
 *                                  success:
 *                                      example: 1
 *                                      type: boolean
 *                                  status:
 *                                      example: 200
 *                                      type: varchar
 *                                  data:
 *                                      type: object
 *             401:
 *                  description: Invalid
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          "Username or Password Incorrect"
 *                                  success:
 *                                      example: 0
 *                                      type: boolean
 *                                  status:
 *                                      example: 401
 *                                      type: varchar
 *                                  data:
 *                                      type: object
 */
router.route("/update").put(verifyToken, transactions.updateTransaction)

/**
 * @swagger
 * /api/v1/transactions/import:
 *      post:
 *          tags:
 *              - Transactions
 *          summary: import bulk transactions
 *          security:
 *              - ApiKeyAuth: []
 *          produces:
 *              - multipart/form-data
 *          requestBody:
 *              description: type file xls/xlsx/csv
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/importTransactions'
 *          responses:
 *             200:
 *                  description: Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Success
 *                                  token:
 *                                      example: varchar
 *                                      type: varchar
 *                                  success:
 *                                      example: 1
 *                                      type: boolean
 *                                  status:
 *                                      example: 200
 *                                      type: varchar
 *                                  data:
 *                                      type: object
 *             401:
 *                  description: Invalid
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          "Username or Password Incorrect"
 *                                  success:
 *                                      example: 0
 *                                      type: boolean
 *                                  status:
 *                                      example: 401
 *                                      type: varchar
 *                                  data:
 *                                      type: object
 */
router.route("/import").post(verifyToken, upload.single("file"), transactions.importBulk);

/**
 * @swagger
 * /api/v1/transactions/template/bulk:
 *      get:
 *          tags:
 *              - Transactions
 *          summary: import template bulk Transactions
 *          responses:
 *             200:
 *                  description: Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Success
 *                                  token:
 *                                      example: varchar
 *                                      type: varchar
 *                                  success:
 *                                      example: 1
 *                                      type: boolean
 *                                  status:
 *                                      example: 200
 *                                      type: varchar
 *                                  data:
 *                                      type: object
 *             401:
 *                  description: Invalid
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          "Username or Password Incorrect"
 *                                  success:
 *                                      example: 0
 *                                      type: boolean
 *                                  status:
 *                                      example: 401
 *                                      type: varchar
 *                                  data:
 *                                      type: object
 */
router.route("/template/bulk").get(transactions.templateBulk)
export = router;