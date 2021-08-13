import * as express from "express";
import * as prize from "./prize";

let router = express.Router();
/**
 * @swagger
 *
 * components:
 *  schemas:
 *      InsertPrize:
 *          type: object
 *          required:
 *              - name
 *              - type
 *              - code
 *          properties:
 *              name:
 *                  example: varchar
 *                  type: varchar
 *              type:
 *                  example: 1
 *                  type: integer
 *              code:
 *                  example: alfamart25
 *                  type: varchaar
 *      balanceEdit:
 *          type: object
 *          required:
 *              - deposit
 *              - gopayPrice
 *          properties:
 *              deposit:
 *                  example: 1000000000
 *                  type: number
 *              gopayPrice:
 *                  example: 26000
 *                  type: number
 *      updatePrizeSetting:
 *          type: object
 *          required:
 *              - startTime
 *              - endTime
 *              - enabled
 *              - limit
 *          properties:
 *                startTime:
 *                    example: "12:12:00"
 *                    type: string
 *                endTime:
 *                    example: "12:12:00"
 *                    type: string
 *                enabled:
 *                    example: 1
 *                    type: number
 *                limit:
 *                    example: 1
 *                    type: number
 *                interval:
 *                    example: 1
 *                    type: number
 *
 *
 */

/**
 * @swagger
 * /api/v1/prizes:
 *      get:
 *          tags:
 *              - Prize
 *          summary: list Prize
 *          security:
 *              - ApiKeyAuth: []
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
router.route("/").get(prize.list)

/**
 * @swagger
 * /api/v1/prizes/summary:
 *      get:
 *          tags:
 *              - Prize
 *          summary: Summary Prize
 *          security:
 *              - ApiKeyAuth: []
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
router.route("/summary").get(prize.summary)

/**
 * @swagger
 * /api/v1/prizes/pulsa?row={row}&page={page}&order={order}&orderCondition={orderCondition}&key={key}&status={status}&pulsaType={pulsaType}&startDate={startDate}&endDate={endDate}:
 *      get:
 *          tags:
 *              - Prize
 *          summary: list Prize Pulsa
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
 *              - name: status
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: pulsaType
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
router.route("/pulsa").get(prize.listPrizePulsa);

/**
 * @swagger
 * /api/v1/prizes/deposit:
 *      get:
 *          tags:
 *              - Prize
 *          summary: Summary Deposit
 *          security:
 *              - ApiKeyAuth: []
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
router.route("/deposit").get(prize.summaryDeposit);

/**
 * @swagger
 * /api/v1/prizes/setting:
 *      get:
 *          tags:
 *              - Prize
 *          summary: list prize setting
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
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
router.route("/setting").get(prize.prizeSettinglist);

/**
 * @swagger
 * /api/v1/prizes/{id}:
 *      put:
 *          tags:
 *              - Prize
 *          summary: Edit setting prize
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: Edit setting prize
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/updatePrizeSetting'
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
router.route("/setting").post(prize.updatePrizeSetting)

router.route("/allocation/setting").post(prize.updateGeneralParameter)

router.route("/allocation/setting").get(prize.listGeneralParameter)

router.route('/allocation').post(prize.addAllocation)

router.route('/allocation/deleted').post(prize.deleteAllocation)

router.route('/allocation/:date/:prize_id').get(prize.totalAllocation)

router.route("/allocation/edit").post(prize.updateAllocation)

export = router