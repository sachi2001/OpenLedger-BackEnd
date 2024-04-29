const Router = require('../custom_package/Route')

const router = new Router();


router.post('/edit', (req, res) =>{
    console.log("Banker Function")
    res.end()
})


module.exports = router