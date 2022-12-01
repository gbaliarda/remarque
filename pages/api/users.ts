// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

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
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.method !== 'POST')
    return res.status(405).end(`Method ${req.method} not allowed`)
  // TODO: create user and then return user as JSON
  res.status(200).json({ name: "John Doe registered" })
}
