import * as express from "express";
import * as mobilePulsa from "./mobilePulsa";

let router = express.Router();
/**
 * @swagger
 *
 * components:
 *  schemas:
 *      mobilePulsa:
 *          type: object
 *          properties:
 *              id:
 *                  example: 1
 *                  type: number
 */

/**
 * @swagger
 * /api/v1/mobilePulsa:
 *      post:
 *          tags:
 *              - mobilePulsa
 *          summary: mobilePulsa
 *          security:
 *              - ApiKeyAuth: []
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: mobilePulsa
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/mobilePulsa'
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
router.route("/").post(mobilePulsa.sendPulsa);

router.route("/status/:id")
export = router;