import type { NextApiRequest, NextApiResponse } from 'next'
import Note from '../../../../models/note'
import User from '../../../../models/user'
import connectMongo from '../../../../utils/connectMongo'
import { getSessionEmail } from '../../../../utils/getSessionEmail'

/**
 * @swagger
 * /api/users/{id}/notes:
 *   get:
 *     security:
 *       - basicAuth: []
 *     description: Retrieves an array of notes that might or not be filtered
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of user to fetch
 *       - name: phrase
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Title and content string that notes have to match
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of page to retrieve starting from 0. If not specified page is 0.
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Amount of notes to retrieve. If not specified retrieves all notes.
 *       - name: lastModified
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Retrieves only notes modified after this date.
 *     responses:
 *       200:
 *         description: An array of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: You must be logged in
 *       404:
 *         description: User not found
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'GET')
    return res.status(405).end(`Method ${req.method} not allowed`)

  const sessionEmail = await getSessionEmail(req, res)
  if(!sessionEmail) return res.status(401).json({ message: "You must be logged in." })

  try {
    await connectMongo()
  } catch (e) {
    return res.status(500).json({ e })
  }

  try {
    const { id, phrase, page = 0, limit = 0, lastModified } = req.query

    await User.findById(id).then(async user => {
      
      if(user == null)
        return res.status(404).json({ msg: `User not found` })

      if(phrase == undefined) {
        const pageToNumber = Number(page), limitToNumber = Number(limit)
        if(Number.isNaN(pageToNumber) || Number.isNaN(limitToNumber) || pageToNumber < 0 || limitToNumber < 0)
          return res.status(400).json({msg: 'Bad Request, page or limit is not valid'})



        if(lastModified == undefined) {
          if(limitToNumber == 0) {
            await Note.find({ owner: user.email }).sort({lastModified: 1}).then(result =>
              res.status(200).send(result)
            ).catch(err => 
              res.status(400).json({ msg: err })
            )
          } else {
            await Note.find({ owner: user.email }).sort({lastModified: 1}).skip(pageToNumber * limitToNumber).limit(limitToNumber).then(result =>
              res.status(200).send(result)
            ).catch(err => 
              res.status(400).json({ msg: err })
            )
          }
        } else {
          const lastModifiedToDate = new Date(Array.isArray(lastModified) ? lastModified[0]:lastModified)
          if(Number.isNaN(lastModifiedToDate))
            return res.status(400).json({msg: 'Bad Request, lastModified date is not valid'})
          
            if(limitToNumber == 0) {
              await Note.find({ owner: user.email, lastModified: { $gte: lastModifiedToDate} }).sort({lastModified: 1}).then(result =>
                res.status(200).send(result)
              ).catch(err => 
                res.status(400).json({ msg: err })
              )
            } else {
              await Note.find({ owner: user.email, lastModified: { $gte: lastModifiedToDate} }).sort({lastModified: 1}).skip(pageToNumber * limitToNumber).limit(limitToNumber).then(result =>
                res.status(200).send(result)
              ).catch(err => 
                res.status(400).json({ msg: err })
              )
            }
        }
      } else {
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
          await Note.esSearch(query).then(queryRes => {
            let result: any = []
            queryRes.hits.hits.forEach((hit: any) => {
              const object = {
                _id: hit._id,
                owner: hit._source.owner,
                title: hit._source.title,
                content: hit._source.content,
                hightlight: hit.highlight
              }
              result = [...result, object]
            })
            return res.status(200).send(result)
          })
        } catch (error) {
          // @ts-ignore
          if(error.status && error.status === 404)
            res.status(404).json({msg: "Index not found, there are no notes to look for"})
          else
            res.status(500).json({ msg: error })
        }
      }
    })
  } catch (e) {
    console.log(e)
    res.status(400).json({ msg: e })
  }
}
