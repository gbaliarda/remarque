// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcrypt"
import connectMongo from '../../utils/connectMongo'
import User from '../../models/user'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405)
  }

  await connectMongo().catch(e => res.status(500).json({ e }))

  try {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 12)
    await User.create({ email, password: hashedPassword })
    res.status(201).json({ msg: "Successfully registered user" })
  } catch (e) {
    console.log(e)
    res.status(400).json({ e })
  }
}