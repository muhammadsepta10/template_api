import * as express from "express";
import * as pushMessage from "./pushMessage";

let router = express.Router();
/**
 * @swagger
 *
 * components:
 *  schemas:
 *      pushMessage:
 *          type: object
 *          properties:
 *              message:
 *                  example: YmlnYmFib2wgY291cG9uI25hbWEjMTIzNDU2Nzg5MDEyMzQ1NiMxMjM0NTY3ODkwMTIja290YQ
 *                  type: string
 *              sender:
 *                  example: "085967025385"
 *                  type: string
 */

/**
 * @swagger
 * /api/v1/pushMessage:
 *      post:
 *          tags:
 *              - pushMessage
 *          summary: pushMessage
 *          security:
 *              - ApiKeyAuth: []
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: pushMessage
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/pushMessage'
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
router.route("/").post(pushMessage.push);

/**
 * @swagger
 * /api/v1/pushMessage/getSender:
 *      get:
 *          tags:
 *              - pushMessage
 *          summary: get Sender
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
router.route("/getSender").get(pushMessage.getSender);
export = router;