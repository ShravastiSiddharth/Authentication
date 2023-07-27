const connectToDatabase = require('./dataBase');
const express = require('express')
var cors = require('cors')


connectToDatabase();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Available routes at the backend.
app.use('/api/auth',require('./routes/authentication'))
app.use('/api/note',require('./routes/note'))

app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})