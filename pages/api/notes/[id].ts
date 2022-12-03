import type { NextApiRequest, NextApiResponse } from 'next'
import Note from '../../../models/note';
import connectMongo from '../../../utils/connectMongo';
import User from '../../../models/user';
import { ObjectId } from 'mongoose';
import { getSessionUser } from '../../../utils/getSessionUser';

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     security:
 *       - basicAuth: []
 *     description: Retrieves a note as JSON
 *     tags:
 *       - Notes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of note to fetch
 *     responses:
 *       200:
 *         description: A single note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request
 *       401:
 *         description: You must be logged in
 *       403:
 *         description: You can not access this note
 *       404:
 *         description: Note not found
 *   post:
 *     security:
 *       - basicAuth: []
 *     description: Duplicates a note
 *     tags:
 *       - Notes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of note to duplicate
 *     responses:
 *       201:
 *         description: Note duplicated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request
 *       401:
 *         description: You must be logged in
 *       403:
 *         description: You can not access this note
 *       404:
 *         description: Note not found
 *   patch:
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
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
 *     description: Edits a note
 *     tags:
 *       - Notes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of note to edit
 *     responses:
 *       200:
 *         description: Note edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Bad request
 *       401:
 *         description: You must be logged in
 *       403:
 *         description: You can not access this note
 *       404:
 *         description: Note not found
 *   delete:
 *     security:
 *       - basicAuth: []
 *     description: Deletes a note
 *     tags:
 *       - Notes
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of note to delete
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: You must be logged in
 *       403:
 *         description: You can not access this note
 *       404:
 *         description: Note not found
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectMongo()
  } catch (e) {
    return res.status(500).json({ e })
  }
  const { id } = req.query

  const sessionUser = await getSessionUser(req, res)
  if(!sessionUser) return res.status(401).json({ message: "You must be logged in." })

  switch(req.method) {
    case 'GET':
      try {
        await Note.findById(id).then(note => {
          if(note == null)
            return res.status(404).json({ msg: `Note not found` })
          
          if(!note.isPublic && note.owner !== sessionUser.email)
            return res.status(403).json({ msg: `Note is not public for ${sessionUser.email}`})

          res.status(200).json({_id: note._id, owner: note.owner, title: note.title, content: note.content, isPublic: note.isPublic, lastModified: note.lastModified})
        })
      } catch (e) {
        console.log(e)
        res.status(400).json({ msg: `Bad request`, description: e})
      }
      break;
    case 'POST':
      try {
        await Note.findById(id).then(async note => {
          if(note == null)
            return res.status(404).json({ msg: `Note not found` })

          if(!note.isPublic && note.owner !== sessionUser.email)
            return res.status(403).json({ msg: `Note is not public for ${sessionUser.email}`})

          await Note.create({owner: sessionUser.email, title: note.title, content: note.content}).then((note) => {
            sessionUser.notes = [...sessionUser.notes, note._id]
            sessionUser.markModified('notes')
            sessionUser.save()
            res.status(201).json({_id: note._id, owner: note.owner, title: note.title, content: note.content, isPublic: note.isPublic, lastModified: note.lastModified})
          })
        })
      } catch (e) {
        console.log(e)
        res.status(400).json({ msg: `Bad request`, description: e})
      }
      break;
    case 'PATCH':
      try {
        const {title, content, isPublic} = req.body
        await Note.findById(id).then(note => {
          if(note == null)
            return res.status(404).json({ msg: `Note not found` })

          if(note.owner !== sessionUser.email)
            return res.status(403).json({ msg: `Note is not owned by ${sessionUser.email}`})

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
          note.lastModified = Date.now()
          note.markModified('lastModified')
          note.save()
          res.status(200).json({_id: note._id, owner: note.owner, title: note.title, content: note.content, isPublic: note.isPublic, lastModified: note.lastModified})
        })
      } catch (e) {
        console.log(e)
        res.status(400).json({ msg: `Bad request`, description: e})
      }
      break;
    case 'DELETE':
      try {
        await Note.findById(id).then(async note => {
          if(note == null)
            return res.status(404).json({ msg: `Note not found` })

          if(note.owner !== sessionUser.email)
            return res.status(403).json({ msg: `Note is not owned by ${sessionUser.email}`})

          await User.findOne({email: note.owner}).then(user => {
            user.notes = user.notes.filter((userNote: ObjectId) => String(userNote) != String(note._id))
            user.markModified("notes")
            user.save()
          })
          note.remove()
          res.status(200).json({ msg: `Note deleted successfully`})
        })
      } catch (e) {
        console.log(e)
        res.status(400).json({ msg: `Bad request`, description: e})
      }
      break;
    default:
      return res.status(405).json({ msg: `Method ${req.method} not allowed`})
  }
}
