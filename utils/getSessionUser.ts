import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { parseAuthBasic } from '../pages/api/auth/[...nextauth]'

export const getSessionUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) return session.user

  const authSession = await parseAuthBasic(req)
  if (!authSession) return null

  return authSession
}