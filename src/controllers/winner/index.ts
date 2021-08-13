import * as express from "express";
import * as winner from "./winner";
import { upload } from '../../middleware/upload';

let router = express.Router();
/**
 * @swagger
 *
 * components:
 *  schemas:
 *      editWinner:
 *          type: object
 *          required:
 *              - id
 *          properties:
 *                id:
 *                    example: 1
 *                    type: number
 *                address:
 *                    example: "jl. kemanggisan no 20 bendungan hilir"
 *                    type: string
 *                resi:
 *                    example: "89siojiudsjku89dsaijox"
 *                    type: string
 *                voucher:
 *                    example: "98dusijdeusixjedwu89sij"
 *                    type: string
 *                accountNumber:
 *                    example: "98307480370484"
 *                    type: string
 *                reference:
 *                    example: "0asdjaps9dksa"
 *                    type: string
 *                status:
 *                    example: 1
 *                    type: string
 *                profileId:
 *                    example: 1
 *                    type: integer
 *                name:
 *                    example: "james"
 *                    type: string
 *                idNumber:
 *                    example: 123453
 *                    type: sttrin
 *                regency:
 *                    example: "jakarta"
 *                    type: string
 *      importWinner:
 *          type: object
 *          required:
 *              - file
 *          properties:
 *                file:
 *                    type: file
 *      selectPicture:
 *          type: object
 *          required:
 *              - entriesId
 *              - attachmentId
 *          properties:
 *                entriesId:
 *                    example: 1
 *                    type: number
 *                attachmentId:
 *                    example: 1
 *                    type: number
 * 
 *      submitDataWinner:
 *          type: object
 *          required:
 *              - entriesId
 *              - purchaseDate
 *              - product
 *              - isValid
 *          properties:
 *              entriesId:
 *                  example: 1
 *                  type: integer
 *              purchaseDate:
 *                  example: 2020-10-10
 *                  type: varchar
 *              variants:
 *                  example: [{"variantId":1,"quantity":12,"price":"2000","totalPrice":"123212"}]
 *                  type: array object
 *              isValid:
 *                  example: 1
 *                  type: integer
 * 
 *      updateAccountNumber:
 *          type: object
 *          required:
 *              - hp
 *          properties:
 *              hp:
 *                  example: "08596709393"
 *                  type: number
 *
 *
 *
 */

/**
 * @swagger
 * /api/v1/winner?row={row}&page={page}&order={order}&orderCondition={orderCondition}&key={key}&columnSearch={columnSearch}&type={type}&startDate={startDate}&endDate={endDate}:
 *      get:
 *          tags:
 *              - Winner
 *          summary: list winner
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
 *              - name: columnSearch
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *              - name: type
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
router.route("/").get(winner.listWinner);

/**
 * @swagger
 * /api/v1/winner/{id}:
 *      get:
 *          tags:
 *              - Winner
 *          summary: Detail winner
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
router.route("/:id").get(winner.detailWinner);

/**
 * @swagger
 * /api/v1/winner/import:
 *      post:
 *          tags:
 *              - Winner
 *          summary: import winner
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
 *                          $ref: '#/components/schemas/importWinner'
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
router.route("/import").post(upload.single("file"), winner.importWinner);

/**
 * @swagger
 * /api/v1/winner/template/import:
 *      get:
 *          tags:
 *              - Winner
 *          summary: import template winner
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
router.route("/template/import").get(winner.templateImportWinner)

/**
 * @swagger
 * /api/v1/winner/submitDataWinner:
 *      post:
 *          tags:
 *              - Winner
 *          summary: Winner
 *          security:
 *              - ApiKeyAuth: []
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: Winner
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/submitDataWinner'
 *          responses:
 *             200:
 *                  description: Login Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Login Success
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
router.route("/submitDataWinner").post(winner.submitDataWinner);

/**
 * @swagger
 * /api/v1/winner/verifyWinner/{id}:
 *      post:
 *          tags:
 *              - Winner
 *          summary: Verify Winner
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                required: true
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
router.route("/verifyWinner/:id").post(winner.approveWinner);

/**
 * @swagger
 * /api/v1/winner/unprocessedWinner/{id}:
 *      post:
 *          tags:
 *              - Winner
 *          summary: Unprocessed Winner
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                required: true
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
router.route("/unprocessedWinner/:id").post(winner.unprocessedWinner);

/**
 * @swagger
 * /api/v1/winner/status/{id}:
 *      put:
 *          tags:
 *              - Winner
 *          summary: Unprocessed Winner
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                required: true
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
router.route("/status/:id").put(winner.updateStatus);


/**
 * @swagger
 * /api/v1/winner/unverifyWinner/{id}:
 *      post:
 *          tags:
 *              - Winner
 *          summary: Unverify Winner
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                required: true
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
router.route("/unverifyWinner/:id").post(winner.unverifyWinner);

/**
 * @swagger
 * /api/v1/winner/{id}:
 *      put:
 *          tags:
 *              - Winner
 *          summary: Update Winner
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                required: true
 *                schema:
 *                  type: string
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: Winner
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/updateAccountNumber'
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
router.route("/:id").put(winner.updateAccountNumber)

export = router;
