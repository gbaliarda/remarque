import type { NextApiRequest, NextApiResponse } from 'next'
import Note from '../../../models/note';
import User from '../../../models/user';
import connectMongo from '../../../utils/connectMongo';

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     description: Retrieves a user as JSON
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of user to fetch
 *     responses:
 *       200:
 *         description: A single user
 *   delete:
 *     description: Deletes a user
 *     tags:
 *       - Users
 *     parameters: 
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  switch(req.method) {
		case 'GET':
			await connectMongo().catch(e => res.status(500).json({ e }))
			
			try {
				await User.findById(id).then(user => {
					if(user !== null) 
						res.status(200).json({email: user.email, notes: user.notes})
					else 
            res.status(404).end(`User not found`)
				})
      } catch (e) {
				console.log(e)
        res.status(404).end(`User not found`)
      }
			break;
		case 'DELETE':
			await connectMongo().catch(e => res.status(500).json({ e }))
			
      try {
				await User.findById(id).then(user => {
					if(user == null)  
						return res.status(404).end(`User not found`)
          Note.deleteMany({ owner: user.email }, err => {
            if (err)
              res.send(err)
          })
          user.remove()
          res.status(200).end(`User deleted`)
				})
      } catch (e) {
				console.log(e)
        res.status(404).end(`User not found`)
      }
			break;
		default:
			return res.status(405).end(`Method ${req.method} not allowed`)
	}
}
