/**
 * @swagger
 * /quiz:
 *  post:
 *      summary: Add a new quiz
 *      description : Add a new quiz with the provided details
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Quiz
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Quiz'
 *      responses:
 *          201:
 *              description: Quiz created successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Quiz'
 *          401: 
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /quiz/{id}:
 *  put:
 *      summary: Update a quiz
 *      description : Update a quiz with the provided details
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Quiz
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the quiz to update
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Quiz'
 *      responses:
 *          200:
 *              description: Quiz updated successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Quiz'
 *          404:
 *              $ref: '#/components/responses/NotFound' 
 *          405:  
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /quiz:
 *  get:
 *      summary: get one quiz by filters
 *      description : find a quiz by filters
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Quiz
 *      parameters:
 *          - in: query
 *            name: q
 *            schema:
 *              type: string
 *            required: true
 *            description: The term to filter by
 *      responses:
 *          200:
 *              description: quiz found successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Quiz'
 *          401: 
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /quiz/{id}:
 *  get:
 *      summary: find quiz by id
 *      description : find a quiz by its id
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the quiz to get
 *      tags:
 *          - Quiz
 *      responses:
 *          200:
 *              description: quiz found successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Quiz'
 *          401: 
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /quizzes_by_filters:
 *  get:
 *      summary: get one or multiple quizzes by filters
 *      description : find quizzes by filters
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Quiz
 *      parameters:
 *          - in: query
 *            name: q
 *            schema:
 *              type: string
 *              example: maths
 *            required: false
 *            description: Name of the category
 *          - in: query
 *            name: page
 *            schema:
 *              type: number
 *            required: false
 *            description: the page number to get
 *          - in: query
 *            name: limit
 *            schema:
 *              type: number
 *            required: false
 *            description: the number of elements per page
 *      responses:
 *          200:
 *              description: quiz(zes) found successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Quiz'
 *          401: 
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /quiz/{id}:
 *  delete:
 *      summary: Delete one quiz
 *      description : delete one quiz by the ID
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the quiz to delete
 *      tags:
 *          - Quiz
 *      responses:
 *          200:
 *              description: Quiz deleted successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Quiz'
 *          401: 
 *              $ref: '#/components/responses/UnauthorizedError'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */