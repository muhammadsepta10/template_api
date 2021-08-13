import * as express from "express";
import * as validasiKtp from "./validasiKtp"

let router = express.Router();

/**
 * @swagger
 *
 * components:
 *  schemas:
 *      InsertCodeRegion:
 *          type: object
 *          required:
 *              - province
 *              - regency
 *              - district
 *              - code
 *          properties:
 *              province:
 *                  type: string
 *                  example: "Jawa Timur"
 *              regency:
 *                  type: string
 *                  example: "Bojonegoro"
 *              district:
 *                  type: string
 *                  example: "Dander"
 *              code:
 *                  type: string
 *                  example: "352206"
 *
 *
 */

/**
 * @swagger
 * /api/v1/ktp/{ktp}:
 *      get:
 *          tags:
 *              - ValidasiKtp
 *          summary: ValidasiKtp
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: ktp
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
router.route("/:ktp").get(validasiKtp.checkKtp);

/**
 * @swagger
 * /api/v1/ktp:
 *      post:
 *          tags:
 *              - ValidasiKtp
 *          summary: Insert Code Region
 *          security:
 *              - ApiKeyAuth: []
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: update transactions
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/InsertCodeRegion'
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
router.route("/").post(validasiKtp.inputCodeRegion)

export = router;