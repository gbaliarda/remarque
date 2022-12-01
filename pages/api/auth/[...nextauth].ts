import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextApiRequest } from "next"
import bcrypt from "bcrypt"
import connectMongo from "../../../utils/connectMongo"
import User from "../../../models/user"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@remarque.com" },
        password: { label: "Password", type: "password" }
      },
      authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        return getUserFromDb(credentials!!.email, credentials!!.password)
      }
    })
  ],
}

export const getUserFromDb = async (email: string, password: string) => {
  await connectMongo()
  const user = await User.findOne({ email })
  if (!user) return null
  const matchPassword = await bcrypt.compare(password, user.password)
  if (!matchPassword) return null
  return user
}

export async function parseAuthBasic(req: NextApiRequest) {
  // check for basic auth header
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return null
  }

  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [email, password] = credentials.split(':')

  const user = await getUserFromDb(email, password)
  return user
}

export default NextAuth(authOptions)