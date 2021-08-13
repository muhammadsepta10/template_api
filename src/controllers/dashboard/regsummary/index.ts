import * as express from "express";
import * as regsummary from "./regsummary";

let router = express.Router();

/**
 * @swagger
 * /api/v1/dashboard/regsummary?subtract={subtract}&monthYear={monthYear}&condition={condition}:
 *      get:
 *          tags:
 *              - Summary
 *          summary: Registration Summary
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: subtract
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: monthYear
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *              - name: condition
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
 *                                          "Error on getting Data"
 *                                  success:
 *                                      example: 0
 *                                      type: boolean
 *                                  status:
 *                                      example: 401
 *                                      type: varchar
 *                                  data:
 *                                      type: object
 */
router.route("/").get(regsummary.countRegistered);

export = router;
