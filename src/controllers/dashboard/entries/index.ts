import * as express from "express";
import * as entries from "./entries";

let router = express.Router();

/**
 * @swagger
 * /api/v1/dashboard/entries?row={row}&media={media}&isValid={isValid}&isReplied={isReplied}&page={page}&startDate={startDate}&endDate={endDate}&key={key}&columnSearch={columnSearch}&isValid={isValid}&order={order}&orderCondition={orderCondition}&subtract={subtract}&type={type}:
 *      get:
 *          tags:
 *              - Entries
 *          summary: list entries
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: row
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: media
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: isValid
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: isReplied
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
 *              - name: columnSearch
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *              - name: isValid
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
router.route("/").get(entries.listEntries);

/**
 * @swagger
 * /api/v1/dashboard/entries/{id}:
 *      get:
 *          tags:
 *              - Entries
 *          summary: list entries
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
router.route("/:id").get(entries.detailEntries);

/**
 * @swagger
 * /api/v1/dashboard/entries/delete/{id}:
 *      delete:
 *          tags:
 *              - Entries
 *          summary: list entries
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
router.route("/delete/:id").delete(entries.deleteEntries);

export = router;