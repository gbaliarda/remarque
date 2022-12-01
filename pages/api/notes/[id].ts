import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     description: Retrieves a note as JSON
 *     tags:
 *       - Notes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of note to fetch
 *     responses:
 *       200:
 *         description: A single note
 *   post:
 *     description: Duplicates a note
 *     tags:
 *       - Notes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of note to duplicate
 *     responses:
 *       200:
 *         description: Note duplicated successfully
 *   patch:
 *     description: Edits a note
 *     tags:
 *       - Notes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of note to edit
 *     responses:
 *       200:
 *         description: Note edited successfully
 *   delete:
 *     description: Deletes a note
 *     tags:
 *       - Notes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of note to delete
 *     responses:
 *       200:
 *         description: Note deleted successfully
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch(req.method) {
    case 'GET':
      // TODO: Retrieve note
      break;
    case 'POST':
      // TODO: Duplicates note
      break;
    case 'PATCH':
      // TODO: Update note
      break;
    case 'DELETE':
      // TODO: Delete note
      break;
    default:
      return res.status(405).end(`Method ${req.method} not allowed`)
  }
  res.status(200).json({ name: 'John Doe' })
}
