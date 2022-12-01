import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

/**
 * @swagger
 * /api/users/{id}/notes:
 *   get:
 *     description: Retrieves an array of notes that might or not be filtered
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of user to fetch
 *       - name: phrase
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Title and content string that notes have to match
 *     responses:
 *       200:
 *         description: An array of notes
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.method !== 'GET')
    return res.status(405).end(`Method ${req.method} not allowed`)
  res.status(200).json({ name: 'John Doe' })
}
