require('./Config/databaseConfig')
const express = require('express')
const userRouter = require("./Router/userRouter")
const recordRouter = require("./Router/recordRouter")
const PORT = process.env.PORT || 8000;

const app = express()
app.use(express.json())
app.use('api',userRouter)
app.use('api', recordRouter)



app.get('/', (req, res)=>{
    res.send('Welcome Message');
});


app.listen(PORT,()=>{
    console.log(`Database connecting to port ${PORT}...`)
})