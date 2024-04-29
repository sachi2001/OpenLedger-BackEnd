const http = require('http')



const customerRouter = require('./src/routes/customer')

const Fleet = require('./src/custom_package/fleet')
const app = new Fleet() // Creating new fleet instant 


const sever = http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({
        message: req.url,
        name: "Sachindu Kavishka",
        age : 22,
        method: req.method
    }))
})


app.use('/customer', customerRouter)

sever.listen(3000, ()=> {
    console.log("Server running on port 3000")
})