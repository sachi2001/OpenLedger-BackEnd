const express = require('express')

const cors = require('cors')

const app = express()

const userRouter = require('./src/routes/user')


const PORT = 3000

// For cors error
app.use(
    cors({
        origin:'http://localhost:5173',
        // origin: 'https://openledgers.netlify.app'
    })
)
// hehe


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/user', userRouter)


app.listen(PORT, () => {
    console.log('API is running on the port ' + PORT + '...')
})