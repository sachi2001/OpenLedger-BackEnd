const Router = require('../custom_package/Route')

const router = new Router();


router.post('/edit', (req, res) =>{
    console.log("Banker Function")


    // Respond to the request 
    res.end(JSON.stringify({
        name : req.body['user_name']
    }))

    
})


module.exports = router