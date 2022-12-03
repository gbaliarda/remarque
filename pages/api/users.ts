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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. Check email and password parameters
 *       409:
 *         description: Conflict. Email might already exist
 *   get:
 *     description: Retrieves user information using email
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request. Check email parameter
 *     parameters: 
 *       - name: email
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of user to retrieve
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectMongo()
  } catch (e) {
    return res.status(500).json({ e })
  }

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
                .then((user) => res.status(201).json({ _id: user._id, email: user.email, notes: user.notes}))
                .catch(() => res.status(409).json({ msg: "User already exists or has invalid email or password" }))
      } catch (e) {
        res.status(400).json({ msg: "User could not be created, both email and password are required and have to be valid", error: e })
      }
      break
    default:
      return res.status(405).end(`Method ${req.method} not allowed`)
  }


}
