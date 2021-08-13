import * as express from "express";
import * as blacklist from "./blacklist";

let router = express.Router();
/**
 * @swagger
 *
 * components:
 *  schemas:
 *      InsertBL:
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
 *      EditBL:
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
 * /api/v1/blacklist?row={row}&page={page}&key={key}&order={order}&orderCondition={orderCondition}:
 *      get:
 *          tags:
 *              - Blacklist
 *          summary: list of Banned cust
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
router.route("/").get(blacklist.blackList);

/**
 * @swagger
 * /api/v1/blacklist/{id}:
 *      get:
 *          tags:
 *              - Blacklist
 *          summary: Blacklist By Id
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

router.route("/:id").get(blacklist.blacklistByid);

/**
 * @swagger
 * /api/v1/blacklist/saveBlacklist:
 *      post:
 *          tags:
 *              - Blacklist
 *          summary: Insert Blacklist
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
 *                          $ref: '#/components/schemas/InsertBL'
 *          responses:
 *             200:
 *                  description: Insert Blacklist Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Insert Blacklist Success
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
router.route("/saveBlacklist").post(blacklist.insertBlacklist);

/**
 * @swagger
 * /api/v1/blacklist/edit:
 *      put:
 *          tags:
 *              - Blacklist
 *          summary: Edit Blacklist
 *          security:
 *              - ApiKeyAuth: []
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: Edit Blacklist
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/EditBL'
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
router.route("/edit").put(blacklist.editBlacklist);

/**
 * @swagger
 * /api/v1/blacklist/deleted/{id}:
 *      delete:
 *          tags:
 *              - Blacklist
 *          summary: Delete Blacklist
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
router.route("/deleted/:id").delete(blacklist.deleteList);

export = router;
