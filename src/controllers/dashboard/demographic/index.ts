import * as express from "express";
import * as demographic from "./demographic";

let router = express.Router();

/**
 * @swagger
 * /api/v1/dashboard/demographic/distribution?type={type}&row={row}&page={page}&startDate={startDate}&endDate={endDate}&key={key}&media={media}&order={order}&orderCondition={orderCondition}&subtract={subtract}:
 *      get:
 *          tags:
 *              - Demographic
 *          summary: list demographic
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: row
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: type
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: page
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
 *              - name: key
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *              - name: media
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
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
 *              - name: subtract
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
router.route("/distribution").get(demographic.listDistribution);

/**
 * @swagger
 * /api/v1/dashboard/demographic/{type}?media={media}:
 *      get:
 *          tags:
 *              - Demographic
 *          summary: list demographic
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: type
 *                in: path
 *                required: true
 *                schema:
 *                  type: string
 *                  example: chart
 *              - name: media
 *                in: path
 *                required: true
 *                schema:
 *                  type: string
 *                  example: 200
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
router.route("/:type").get(demographic.demographic)

router.route("/v2/:type").get(demographic.demographicV2)
export = router;