import * as express from "express";
import { upload } from "../../middleware/upload";
import * as allocations from "./allocations";


let router = express.Router();

/**
 * @swagger
 *
 * components:
 *  schemas:
 *      moveAllocations:
 *          type: object
 *          required:
 *              - dateFr
 *              - dateTo
 *              - prizeId
 *              - quantity
 *          properties:
 *              dateFr:
 *                  example: "2020-10-10"
 *                  type: string
 *              dateTo:
 *                  example: "2020-10-10"
 *                  type: string
 *              prizeId:
 *                  example: 1
 *                  type: number
 *              quantity:
 *                  example: 1
 *                  type: number
 * 
 *      addAllocations:
 *          type: object
 *          required:
 *              - dateTarget
 *              - prizeId
 *              - quantity
 *          properties:
 *              dateTarget:
 *                  example: "2020-10-10"
 *                  type: string
 *              prizeId:
 *                  example: 1
 *                  type: number
 *              quantity:
 *                  example: 1
 *                  type: number
 * 
 *      importAllocation:
 *          type: object
 *          required:
 *              - file
 *          properties:
 *              file:
 *                  type: file

 *
 *
 */

/**
 * @swagger
 * /api/v1/allocations?condition={condition}&row={row}&page={page}&order={order}&orderCondition={orderCondition}&type={type}:
 *      get:
 *          tags:
 *              - Allocations
 *          summary: list allocations
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
 *              - name: condition
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *              - name: type
 *                in: path
 *                required: true
 *                schema:
 *                  type: string
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
router.route("/").get(allocations.listAllocations)

/**
 * @swagger
 * /api/v1/allocations/{regionId}?condition={condition}&parameter={parameter}&year={year}:
 *      get:
 *          tags:
 *              - Allocations
 *          summary: detaile allocations
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: regionId
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *                  example: 0
 *              - name: condition
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *                  example: DAILY
 *              - name: parameter
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *                  example: MjAyMS0wMS0yMA==
 *              - name: year
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *                  example: 2021
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
router.route("/:regionId/").get(allocations.detaileAllocations)

/**
 * @swagger
 * /api/v1/allocations/moveAllocation:
 *      post:
 *          tags:
 *              - Allocations
 *          summary: move allocations
 *          security:
 *              - ApiKeyAuth: []
 *
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: move allocations
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/moveAllocations'
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
router.route("/moveAllocation").post(allocations.updateAllocation)

/**
 * @swagger
 * /api/v1/allocations/addAllocation:
 *      post:
 *          tags:
 *              - Allocations
 *          summary: Add allocations
 *          security:
 *              - ApiKeyAuth: []
 *
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: Add allocations
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/addAllocations'
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
router.route("/addAllocation").post(allocations.addNewAllocation)

/**
 * @swagger
 * /api/v1/allocations/move/show?date={date}&prizeId={prizeId}:
 *      get:
 *          tags:
 *              - Allocations
 *          summary: get data to move allocation
 *          security:
 *              - ApiKeyAuth: []
 *          parameters:
 *              - name: prizeId
 *                in: path
 *                required: false
 *                schema:
 *                  type: number
 *              - name: date
 *                in: path
 *                required: false
 *                schema:
 *                  type: string
 *                  example: 2020-09-27
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
router.route("/move/show").get(allocations.listMove)



/**
 * @swagger
 * /api/v1/allocations/import:
 *      post:
 *          tags:
 *              - Allocations
 *          summary: import alocations
 *          security:
 *              - ApiKeyAuth: []
 *
 *          produces:
 *              - multipart/form-data
 *          requestBody:
 *              description: import alocations
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#/components/schemas/importAllocation'
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
router.route("/import").post(upload.single('file'), allocations.importAllocations)

export = router;