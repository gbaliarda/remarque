import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     description: Retrieves a user as JSON
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of user to fetch
 *     responses:
 *       200:
 *         description: A single user
 *   delete:
 *     description: Deletes a user
 *     tags:
 *       - Users
 *     parameters: 
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
	switch(req.method) {
		case 'GET':
			// TODO: Retrieve user
			break;
		case 'DELETE':
			// TODO: Delete user
			break;
		default:
			return res.status(405).end(`Method ${req.method} not allowed`)
	}
  res.status(200).json({ name: 'John Doe' })
}
