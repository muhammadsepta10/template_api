import * as express from "express";
import * as whitelist from "./whitelist";

let router = express.Router();
/**
 * @swagger
 *
 * components:
 *  schemas:
 *      InsertWL:
 *          type: object
 *          required:
 *              - name
 *              - sender
 *              - idNumber
 *          properties:
 *              name:
 *                  example: varchar
 *                  type: varchar
 *              sender:
 *                  example: varchar
 *                  type: varchar
 *              idNumber:
 *                  example: 32750
 *                  type: number
 *             
 *
 *      EditWL:
 *          type: object
 *          required:
 *              - name
 *              - sender
 *              - idNumber
 *              - id
 *          properties:
 *              name:
 *                  example: varchar
 *                  type: varchar
 *              sender:
 *                  example: varchar
 *                  type: varchar
 *              idNumber:
 *                  example: 32750
 *                  type: number
 *              id:
 *                  example: 2
 *                  type: integer
 *
 *
 */

/**
 * @swagger
 * /api/v1/whitelist?row={row}&page={page}&key={key}&order={order}&orderCondition={orderCondition}:
 *      get:
 *          tags:
 *              - Whitelist
 *          summary: list of Passthrough Internal
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
 *              - name: key
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
router.route("/").get(whitelist.whiteList);

/**
 * @swagger
 * /api/v1/whitelist/{id}:
 *      get:
 *          tags:
 *              - Whitelist
 *          summary: Whitelist By Id
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *                  example: 1
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

router.route("/:id").get(whitelist.whitelistByid);

/**
 * @swagger
 * /api/v1/whitelist/saveWhitelist:
 *      post:
 *          tags:
 *              - Whitelist
 *          summary: Insert Whitelist
 *          security:
 *              - ApiKeyAuth: []
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: Insert User
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InsertWL'
 *          responses:
 *             200:
 *                  description: Insert Whitelist Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Insert Whitelist Success
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
router.route("/saveWhitelist").post(whitelist.insertWhitelist);

/**
 * @swagger
 * /api/v1/whitelist/edit:
 *      put:
 *          tags:
 *              - Whitelist
 *          summary: Edit Whitelist
 *          security:
 *              - ApiKeyAuth: []
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: Edit Whitelist
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/EditWL'
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
router.route("/edit").put(whitelist.editWhitelist);

/**
 * @swagger
 * /api/v1/whitelist/deleted/{id}:
 *      delete:
 *          tags:
 *              - Whitelist
 *          summary: Delete Whitelist
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                required: true
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
router.route("/deleted/:id").delete(whitelist.deleteList);

export = router;
