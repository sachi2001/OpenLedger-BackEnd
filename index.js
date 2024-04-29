const http = require('http')

const PORT = 3000



const customerRouter = require('./src/routes/customer')

const bankerRouter = require('./src/routes/banker')

const Fleet = require('./src/custom_package/fleet')
// Custom fleet package is introduce to replace the express package
const app = new Fleet() // Creating new fleet instant 



// const sever = http.createServer((req, res)=>{
//     res.writeHead(200, {'Content-Type': 'application/json'})
//     res.end(JSON.stringify({
//         message: req.url,
//         name: "Sachindu Kavishka",
//         age : 22,
//         method: req.method
//     }))
// })


app.use('/customer', customerRouter)

app.use('/banker', bankerRouter)


app.listen(PORT, () => {
    console.log(`Sever is running on port ${PORT}`)
})

// sever.listen(3000, ()=> {
//     console.log("Server running on port 3000")
// })