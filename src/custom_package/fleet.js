const http = require('http')

class Fleet {
    constructor() {
        this.fleetBundle = []
        this.breakLoop = false
    }

    listen(PORT, func) {

        this.server = http.createServer((req, res) => {
            let count = 0
            for(let useCase of this.fleetBundle) {
                console.log("UseCase ", useCase)
                //Outer loop that iterate with use case objects
                for(let router of useCase.router.routeBundle) {
                    console.log("Routes ", router)
                    // Inside loop that iterate with route objects
                    if(req.url === `${useCase.usePath}${router.route}` && req.method === router.method) {
                        res.writeHead(200, {'Content-Type': 'application/json'})
                        router.function(req, res)
                        this.breakLoop = true
                        break // Break the inner loop when the request is satisfied 
                    }
                    console.log(++count)
                }
                // Break the outer loop when request is satisfied 
                if(this.breakLoop) {
                    this.breakLoop = false
                    break
                }
            }
        })

        this.server.listen(PORT, () => func())
        
    }
    
    use(usePath, route) {
        this.fleetBundle.push({
            usePath: usePath,
            router: route
        })
    }

}

module.exports = Fleet