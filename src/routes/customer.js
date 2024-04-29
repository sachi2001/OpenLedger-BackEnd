const Router = require('../custom_package/Route')

const router = new Router();


router.post('/hello', ()=> {
    console.log('Hello Router')
})



module.exports = router