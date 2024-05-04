const Router = require('../custom_package/Route')

const router = new Router();


router.post('/hello', (req, res) => {
    console.log('Hello Router')
    
})

router.get('/sometimes', (req, res) => {
    console.log('Router get method...')
})



module.exports = router