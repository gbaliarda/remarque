import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import Note from '../../../models/note';
import User from '../../../models/user';
import connectMongo from '../../../utils/connectMongo';
import { getSessionEmail } from '../../../utils/getSessionEmail';

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     security:
 *       - basicAuth: []
 *     description: Retrieves a user as JSON
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of user to fetch
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: You must be logged in
 *       404:
 *         description: User not found
 *   delete:
 *     security:
 *       - basicAuth: []
 *     description: Deletes a user
 *     tags:
 *       - Users
 *     parameters: 
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: You must be logged in
 *       400:
 *         description: Bad request
 *       403:
 *         description: You do not have enough permissions
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  const sessionEmail = await getSessionEmail(req, res)
  if(!sessionEmail) return res.status(401).json({ message: "You must be logged in." })

  switch(req.method) {
    case 'GET':
      try {
        await connectMongo()
      } catch (e) {
        return res.status(500).json({ e })
      }
      
      try {
        await User.findById(id).then(user => {
          if(user !== null) 
            res.status(200).json({ _id: user._id, email: user.email, notes: user.notes })
          else 
            res.status(404).json({ msg:`User not found` })
        })
      } catch (e) {
        console.log(e)
        res.status(400).json({ msg: e })
      }
      break;
    case 'DELETE':
      try {
        await connectMongo()
      } catch (e) {
        return res.status(500).json({ e })
      }

      try {
        await User.findById(id).then(async user => {
          if(user.email !== sessionEmail)
            return res.status(403).json({msg: "You do not have enough permissions to perform this operation"})

          await user.remove()
          user.notes.forEach(async (noteId: any) => {
            await Note.findByIdAndRemove(noteId).then(async note => {
              await note.remove()
            })
          })
          res.status(200).json({ msg: `User deleted` })
        })
      } catch (e) {
        console.log(e)
        res.status(400).json({ msg: e })
      }
      break;
    default:
      return res.status(405).json({ msg: `Method ${req.method} not allowed` })
  }
}
