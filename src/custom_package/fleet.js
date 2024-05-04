const http = require('http')

// Response handling
class Response {
    #statusCode
    
    state(statusCode) {
        this.#statusCode = statusCode
    }
}

class Fleet {
    constructor() {
        this.fleetBundle = []
        this.breakLoop = false
    }

    

    async listen(PORT, func) {
        // Initiate the sever 
        this.server = http.createServer(await (async (req, res) => {
            let count = 0
            for(let useCase of this.fleetBundle) {
                //Outer loop that iterate with use case objects
                for(let router of useCase.router.routeBundle) {
                    // Inside loop that iterate with route objects
                    if(req.url === `${useCase.usePath}${router.route}` && req.method === router.method) {
                        let dataBody = "" // Concatenate the req.body string
                        req.on('data', (chunk) => {
                            dataBody += chunk
                        })


                        req.on('end', () => {
                            // Creating request body
                            const request = {
                                body: JSON.parse(dataBody)
                            }
                            res.writeHead(200, {'Content-Type': 'application/json'})
                            router.function(request, res)
                        })

                        
                        this.breakLoop = true
                        break // Break the inner loop when the request is satisfied 
                    }
                    count++;
                }
                // Break the outer loop when request is satisfied 
                if(this.breakLoop) {
                    this.breakLoop = false
                    break
                }
            }
        }))

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