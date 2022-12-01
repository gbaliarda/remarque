// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { parseAuthBasic } from './auth/[...nextauth]'

type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session = await unstable_getServerSession(req, res, authOptions)

  // try to authenticate with next-auth session
  if (!session) {
    // try to authenticate with Authorization (Basic) header
    const user = await parseAuthBasic(req)
    if (!user) {
      return res.status(401).json({ message: "You must be logged in." })
    }
  }

  res.status(200).json({ message: 'John Doe' })
}
