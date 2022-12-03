import type { NextApiRequest, NextApiResponse } from 'next'
import Note from '../../models/note'
import connectMongo from '../../utils/connectMongo'
import { getSessionUser } from '../../utils/getSessionUser'

/**
 * @swagger
 * /api/notes:
 *   post:
 *     security:
 *       - basicAuth: []
 *     description: Creates a new note
 *     tags:
 *       - Notes
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Note's title
 *                 example: Remarque
 *                 required: false
 *               content:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Note's content
 *                 required: false
 *                 example: ["# Hello", "Note description"]
 *               isPublic:
 *                 type: boolean
 *                 description: Define whether the note can be duplicated or not
 *                 required: false
 *                 example: false
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: You must be logged in
 *       400:
 *         description: Bad request.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'POST')
    return res.status(405).end(`Method ${req.method} not allowed`)

  const sessionUser = await getSessionUser(req, res)
  if(!sessionUser) return res.status(401).json({ message: "You must be logged in." })

  try {
    await connectMongo()
  } catch (e) {
    return res.status(500).json({ e })
  }

  try {
    const { title = "Untitled", content = [], isPublic = false } = req.body

    await Note.create({owner: sessionUser.email, title, content, isPublic}).then((note) => {
      sessionUser.notes = [...sessionUser.notes, note._id]
      sessionUser.markModified('notes')
      sessionUser.save()
      res.status(201).json({ _id: note._id, owner: note.owner, title: note.title, content: note.content, isPublic: note.isPublic, lastModified: note.lastModified })
    })
  } catch (e) {
    console.log(e)
    res.status(400).json({ msg: "Note could not be created" , description: e })
  }
}
