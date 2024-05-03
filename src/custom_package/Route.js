class Route {
    constructor() {
        // Declare a empty router bundle in the creation of the instant
        this.routeBundle = []
    }

    // Add router post requests
    post(routePath, funC) {
        this.routeBundle.push({
            route: routePath,
            function: funC,
            method: "POST"
        })

    }

    // Add router get requests 
    get(routePath, funC) {
        this.routeBundle.push({
            route: routePath,
            function: funC,
            method: "GET"
        })
    }

    put(routePath, funC) {
        this.routeBundle.push({
            route: routePath,
            function: funC,
            method: "PUT"
        })
    }

    delete(routePath, funC) {
        this.routeBundle.push({
            route: routePath,
            function: funC,
            method: "DELETE"
        })
    }


}

module.exports = Route