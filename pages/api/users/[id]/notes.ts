import { CallbackError } from 'mongoose'
import type { NextApiRequest, NextApiResponse } from 'next'
import Note from '../../../../models/note'
import User from '../../../../models/user'
import connectMongo from '../../../../utils/connectMongo'
import { authOptions } from '../../auth/[...nextauth]'
import { unstable_getServerSession } from "next-auth/next"
import { parseAuthBasic } from '../../auth/[...nextauth]'

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

  const session = await unstable_getServerSession(req, res, authOptions)

  // try to authenticate with next-auth session
  if (!session) {
    // try to authenticate with Authorization (Basic) header
    const sessionUser = await parseAuthBasic(req)
    if (!sessionUser) {
      return res.status(401).json({ msg: "You must be logged in." })
    }

    await connectMongo().catch(e => res.status(500).json({ e }))
  
    try {
      const { id, phrase } = req.query 
  
      await User.findById(id).then(async user => {
        
        if(user == null) {
          console.log(user)
          return res.status(404).json({ msg: `User not found` })
        }

        if(phrase == null) {
          await Note.find({ owner: user.email }).then(result =>
            res.status(200).json({notes: result})
          ).catch(err => 
            res.status(500).json({ msg: err })
          )
        }
        
        const query = {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: phrase,
                    fields: [
                     "title^2",
                     "content"
                    ],
                    type: "phrase"
                  }
                },
                {
                  match_phrase: {
                    owner: user.email
                  }
                }
              ]
            }
          },
          highlight: {
            fields: {
              "title": {},
              "content":{}
            }
          }
        }

        //Query via mongoosastic to elasticsearch
        
        try {
          //@ts-ignore
          const queryResult = await Note.esSearch(query)
          res.status(200).json({msg: queryResult})
        } catch (error) {
          res.status(500).json({ msg: error })
        }

      })
    } catch (e) {
      console.log(e)
      res.status(400).json({ msg: e })
    }
  }
}
