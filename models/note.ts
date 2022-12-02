import { mongoosastic } from 'mongoosastic-ts';
import { MongoosasticDocument, MongoosasticModel, MongoosasticPluginOpts } from 'mongoosastic-ts/dist/types';
import { Schema, model, models, Document } from 'mongoose'


const noteSchema = new Schema({
  owner: {
    type: String,
    required: true,
    es_indexed: true
  },
  title: {
    type: String,
    required: true,
    es_indexed: true
  },
  content: {
    type: Array<String>,
    required: true,
    es_indexed: true
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

//@ts-ignore
noteSchema.plugin(mongoosastic);

const Note = models.Note || model('Note', noteSchema)

export default Note