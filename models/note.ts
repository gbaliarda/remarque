import { Schema, model, models } from 'mongoose'

const noteSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: Array<String>,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
})

const Note = models.Note || model('Note', noteSchema)

export default Note