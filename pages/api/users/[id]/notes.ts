import { CallbackError } from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import Note from '../../../../models/note'
import User from '../../../../models/user'
import connectMongo from '../../../../utils/connectMongo'

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
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET')
    return res.status(405).end(`Method ${req.method} not allowed`)

  await connectMongo().catch(e => res.status(500).json({ e }))
  try {
    const { id, phrase } = req.query 

    await User.findById(id).then(user => {
      if(user == null)  
        return res.status(404).end(`User not found`)

      Note.find({ owner: user.email }).then(result =>
        res.status(200).json(result)
      ).catch(err => 
        res.status(500).end(err)
      )
    })
  } catch (e) {
    console.log(e)
    res.status(404).end(`User not found`)
  }
}
