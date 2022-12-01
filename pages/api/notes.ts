import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

/**
 * @swagger
 * /api/notes:
 *   post:
 *     description: Creates a new note
 *     tags:
 *       - Notes
 *     responses:
 *       200:
 *         description: Note created successfully
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.method !== 'POST')
    return res.status(405).end(`Method ${req.method} not allowed`)
  // TODO: create a new note and return sth
  res.status(200).json({ name: 'John Doe' })
}
