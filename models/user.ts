import { Schema, model, models, ObjectId, Document} from 'mongoose'

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  notes: {
    type: Array<ObjectId>,
  }
})

const User = models.User || model('User', userSchema)

export default User