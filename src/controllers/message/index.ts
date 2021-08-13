import * as express from "express";
import * as message from "./message";

let router = express.Router();

/**
 * @swagger
 *
 * components:
 *  schemas:
 *      insertMessage:
 *          type: object
 *          properties:
 *              message:
 *                  example: varchar
 *                  type: varchar
 *
 *
 */

/**
 * @swagger
 * /api/v1/message:
 *      get:
 *          tags:
 *              - message
 *          summary: list message group by profile
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
router.route("/").get(message.getMessage);

export = router;