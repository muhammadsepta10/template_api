import * as express from "express";
import { route } from "../auth";
import * as coupon from "./coupon"

let router = express.Router();

/**
 * @swagger
 * /api/v1/coupons/check/{coupon}:
 *      get:
 *          tags:
 *              - Coupon
 *          summary: Check Coupon
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: coupon
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
router.route("/check/:coupon").get(coupon.checkCoupon)

export = router
