const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Post'
const CONLLECTION_NAME = 'posts'

const postSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        likes: {
            type: Map,
            of: Boolean,
            default: {},
        },
        comments: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        collection: CONLLECTION_NAME,
    }
)

module.exports = model(DOCUMENT_NAME, postSchema)
