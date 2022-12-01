import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcrypt"
import connectMongo from '../../utils/connectMongo'
import User from '../../models/user'

/**
 * @swagger
 * /api/users:
 *   post:
 *     description: Creates a new user
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User created successfully
 *   get:
 *     description: Retrieves user information using email
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A single user
 *     parameters: 
 *       - name: email
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of user to retrieve
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo().catch(e => res.status(500).json({ e }))

  switch (req.method) {
    case 'GET':
      try {
        const { email } = req.query
        await User.findOne({ email }).then(user => res.status(200).json({ _id: user._id, email: user.email, notes: user.notes}))
      } catch (e) {
        console.log(e)
        res.status(400).json({ msg: e })
      }
      break
    case 'POST':
      try {
        const { email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 12)
        await User.create({ email, password: hashedPassword })
        res.status(201).json({ msg: "Successfully registered user" })
      } catch (e) {
        console.log(e)
        res.status(400).json({ msg: e })
      }
      break
    default:
      return res.status(405).end(`Method ${req.method} not allowed`)
  }


}
