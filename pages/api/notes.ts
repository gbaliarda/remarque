import type { NextApiRequest, NextApiResponse } from 'next'
import Note from '../../models/note'
import connectMongo from '../../utils/connectMongo'
import { authOptions } from './auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { parseAuthBasic } from './auth/[...nextauth]'

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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'POST')
    return res.status(405).end(`Method ${req.method} not allowed`)

  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    const sessionUser = await parseAuthBasic(req)
    if (!sessionUser) {
      return res.status(401).json({ message: "You must be logged in." })
    }

    await connectMongo().catch(e => res.status(500).json({ e }))

    try {
      const { title, content, isPublic } = req.body
      await Note.create({owner: sessionUser.email, title, content, isPublic}).then((note) => {
        sessionUser.notes = [...sessionUser.notes, note._id]
        sessionUser.markModified('notes')
        sessionUser.save()
      })
      res.status(201).json({ msg: "Successfully note created" })
    } catch (e) {
      console.log(e)
      res.status(400).json({ msg: e })
    }
  }
}
