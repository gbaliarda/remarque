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
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end(`Method ${req.method} not allowed`)
  }

  await connectMongo().catch(e => res.status(500).json({ e }))

  try {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    await User.create({ email, password: hashedPassword })
    res.status(201).json({ msg: "Successfully registered user" })
  } catch (e) {
    console.log(e)
    res.status(400).json({ msg: e })
  }
}
