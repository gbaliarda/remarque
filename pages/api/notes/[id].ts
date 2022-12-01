import type { NextApiRequest, NextApiResponse } from 'next'
import Note from '../../../models/note';
import connectMongo from '../../../utils/connectMongo';
import { authOptions } from '../auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { parseAuthBasic } from '../auth/[...nextauth]'

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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo().catch(e => res.status(500).json({ e }))
  const { id } = req.query

  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    const sessionUser = await parseAuthBasic(req)
    if (!sessionUser) {
      return res.status(401).json({ message: "You must be logged in." })
    }

    switch(req.method) {
      case 'GET':
        try {
          await Note.findById(id).then(note => {
            if(note == null)
              return res.status(404).end(`Note not found`)
            
            if(!note.isPublic && note.owner !== sessionUser.email)
              return res.status(403).end(`Note is not public for ${sessionUser.email}`)
  
            res.status(200).json({owner: note.owner, title: note.title, content: note.content, isPublic: note.isPublic, lastModified: note.lastModified})
          })
        } catch (e) {
          console.log(e)
          res.status(404).end(`Note not found`)
        }
        break;
      case 'POST':
        try {
          await Note.findById(id).then(note => {
            if(note == null)
              return res.status(404).end(`Note not found`)
  
            if(!note.isPublic && note.owner !== sessionUser.email)
              return res.status(403).end(`Note is not public for ${sessionUser.email}`)

            Note.create({owner: sessionUser.email, title: note.title, content: note.content}).then((note) => {
              sessionUser.notes = [...sessionUser.notes, note._id]
              sessionUser.markModified('notes')
              sessionUser.save()
            })
            res.status(201).json({ msg: `Note duplicated successfully`})
          })
        } catch (e) {
          console.log(e)
          res.status(404).end(`Note not found`)
        }
        break;
      case 'PATCH':
        try {
          const {owner, title, content, isPublic} = req.body
          await Note.findById(id).then(note => {
            if(note == null)
              return res.status(404).end(`Note not found`)
  
            if(note.owner !== sessionUser.email)
              return res.status(403).end(`Note is not owned by ${sessionUser.email}`)

            if(owner) {
              note.owner = owner
              note.markModified('owner')
            }
            if(title) {
              note.title = title
              note.markModified('title')
            }
            if(content) {
              note.content = content
              note.markModified('content')
            }
            if(isPublic) {
              note.isPublic = isPublic
              note.markModified('isPublic')
            }
            note.save()
            res.status(201).json({ msg: `Note updated successfully`})
          })
        } catch (e) {
          console.log(e)
          res.status(404).end(`Note not found`)
        }
        break;
      case 'DELETE':
        try {
          await Note.findById(id).then(note => {
            if(note == null)
              return res.status(404).end(`Note not found`)
  
            if(note.owner !== sessionUser.email)
              return res.status(403).end(`Note is not owned by ${sessionUser.email}`)

            note.remove()
            res.status(200).json({ msg: `Note deleted successfully`})
          })
        } catch (e) {
          console.log(e)
          res.status(404).end(`Note not found`)
        }
        break;
      default:
        return res.status(405).end(`Method ${req.method} not allowed`)
    }
  }
}
