import type { NextApiRequest, NextApiResponse } from 'next'
import Note from '../../../models/note';
import User from '../../../models/user';
import connectMongo from '../../../utils/connectMongo';
import { authOptions } from '../auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { parseAuthBasic } from '../auth/[...nextauth]'

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
 *         description: User not found
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    const sessionUser = await parseAuthBasic(req)
    if (!sessionUser) {
      return res.status(401).json({ msg: "You must be logged in." })
    }

    switch(req.method) {
      case 'GET':
        await connectMongo().catch(e => res.status(500).json({ e }))
        
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
        await connectMongo().catch(e => res.status(500).json({ e }))
        
        try {
          await Note.deleteMany({ owner: sessionUser.email }, err => {
            if (err)
              return res.status(500).json({ msg: err })
          })
          sessionUser.remove()
          res.status(200).json({ msg: `User deleted` })
        } catch (e) {
          console.log(e)
          res.status(400).json({ msg: e })
        }
        break;
      default:
        return res.status(405).json({ msg: `Method ${req.method} not allowed` })
    }
  }
}
