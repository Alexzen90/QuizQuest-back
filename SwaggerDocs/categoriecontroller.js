/**
 * @swagger
 * /categorie:
 *   post:
 *     summary: Add Categorie
 *     description : Add  a new Categorie
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categorie'
 *     responses:
 *       201:
 *         description: Categorie created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categorie/{id}:
 *   put:
 *     summary: Update Categorie
 *     description : Update a Categorie with the provided details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Object ID of the Categorie to update
 *     tags:
 *       - Categorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categorie'
 *     responses:
 *       200:
 *         description: Categorie updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categorie/{id}:
 *   get:
 *     summary: Get one Categorie
 *     description : find a Categorie by its id
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorie
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Object ID of the Categorie to get
 *     responses:
 *       200:
 *         description: Categorie found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categorie:
 *   get:
 *     summary: Get one Categorie by filters
 *     description : find a Categorie by filters
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorie
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
 *         description: Categorie(s) found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories_by_filters:
 *   get:
 *     summary: Get one or multiple Categories by filters
 *     description : find Categories by filters
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorie
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
 *         description: Categorie(s) found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete one Categorie
 *     description : delete one Categorie by the ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorie
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Object ID of the Categorie to delete
 *     responses:
 *       200:
 *         description: Categorie deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       405:
 *         $ref: '#/components/responses/ValidationError'
 *       500:
 *         description: Internal server error
 */