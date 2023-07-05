const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const path = require('node:path')
const { fileURLToPath } = require('url')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const postRoutes = require('./routes/posts')

const { register } = require('./controllers/auth')
const { createPost } = require('./controllers/post')

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
        limit: '30mb',
    })
)
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))

app.use(morgan('dev'))

app.use(cors())
app.use(compression())

app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

// file storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

// connect mongoose

app.post('/auth/register', upload.single('picture'), register)
app.post('/posts', upload.single('picture'), createPost)

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

const PORT = process.env.PORT || 8080

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running port: ${PORT}`)
        })
    })
    .catch((e) => console.log(e))
