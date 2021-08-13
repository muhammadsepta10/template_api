import * as express from "express";
import * as replies from "./replies";

let router = express.Router();
/**
 * @swagger
 *
 * components:
 *  schemas:
 *      InsertReplies:
 *          type: object
 *          required:
 *              - name
 *              - reply
 *          properties:
 *              name:
 *                  example: varchar
 *                  type: varchar
 *              reply:
 *                  example: varchar
 *                  type: varchar
 *             
 *
 *      EditReplies:
 *          type: object
 *          required:
 *              - name
 *              - reply
 *              - id
 *          properties:
 *              name:
 *                  example: varchar
 *                  type: varchar
 *              replies:
 *                  example: varchar
 *                  type: varchar
 *              id:
 *                  example: 2
 *                  type: integer
 *
 *
 */

/**
 * @swagger
 * /api/v1/replies?row={row}&page={page}&key={key}&order={order}&orderCondition={orderCondition}:
 *      get:
 *          tags:
 *              - Replies
 *          summary: list replies
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
router.route("/").get(replies.listReplies);

/**
 * @swagger
 * /api/v1/replies/{id}:
 *      get:
 *          tags:
 *              - Replies
 *          summary: Reply By Id
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

router.route("/:id").get(replies.repliesByid);

/**
 * @swagger
 * /api/v1/replies/saveReplies:
 *      post:
 *          tags:
 *              - Replies
 *          summary: Insert replies
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
 *                          $ref: '#/components/schemas/InsertReplies'
 *          responses:
 *             200:
 *                  description: Insert Replies Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Insert Replies Success
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
router.route("/saveReplies").post(replies.insertReply);

/**
 * @swagger
 * /api/v1/replies/edit:
 *      put:
 *          tags:
 *              - Replies
 *          summary: Edit Replies
 *          security:
 *              - ApiKeyAuth: []
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: Edit Replies
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/EditReplies'
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
router.route("/edit").put(replies.editReply);

/**
 * @swagger
 * /api/v1/replies/deleted/{id}:
 *      delete:
 *          tags:
 *              - Replies
 *          summary: Delete Replies
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
router.route("/deleted/:id").delete(replies.deleteReply);

export = router;
