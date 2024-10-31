/**
 * @swagger
 * /question:
 *   post:
 *     summary: Add Question
 *     description : Add  a new Question
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Add multiple Questions
 *     description : Add multiple Questions
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /question/{id}:
 *   put:
 *     summary: Update Question
 *     description : Update a Question with the provided details
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Object ID of the Question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Question updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /question/{id}:
 *   get:
 *     summary: find Question by id
 *     description : find a Question by its id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Object ID of the Question to get
 *     tags:
 *       - Question
 *     responses:
 *       200:
 *         description: Question found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /question:
 *   get:
 *     summary: Get one Question by filters
 *     description : find a Question by filters
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Question
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           example: maths
 *         required: false
 *         description: The term to filter by
 *     responses:
 *       200:
 *         description: Question(s) found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /questions_by_filters:
 *   get:
 *     summary: Get one or multiple Questions by filters
 *     description : find Questions by filters
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Question
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           example: maths
 *         required: false
 *         description: The term to filter by
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *         required: false
 *         description: The page number to get
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *         required: false
 *         description: The number of elements per page
 *     responses:
 *       200:
 *         description: Question(s) found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /question/{id}:
 *   delete:
 *     summary: Delete Question
 *     description : Delete a Question by its id
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Object ID of the Question to delete
 *     responses:
 *       200:
 *         description: Question deleted successfully.
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */