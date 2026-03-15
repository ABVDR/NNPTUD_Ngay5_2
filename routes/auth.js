var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, validatedResult } = require('../utils/validator')
let {CheckLogin} = require('../utils/authHandler')
const { ChangePasswordValidator } = require('../utils/changePasswordValidator')

//login
router.post('/login',async function (req, res, next) {
    let { username, password } = req.body;
    let result = await userController.QueryLogin(username,password);
    if(!result){
        res.status(404).send("thong tin dang nhap khong dung")
    }else{
        res.send(result)
    }
    
})
router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        let newUser = await userController.CreateAnUser(
            username, password, email, '69b6231b3de61addb401ea26'
        )
        res.send(newUser)
    } catch (err) {
        const status = err.status || 400;
        res.status(status).send({ message: err.message });
    }
})
router.get('/me',CheckLogin,function(req,res,next){
    res.send(req.user)
})

//register
//changepassword
//me
//forgotpassword
//permission
//changepassword
router.post('/changepassword', CheckLogin, ChangePasswordValidator, validatedResult, async function (req, res, next) {
    try {
        const userId = req.user[0]._id || req.user._id;
        const { oldpassword, newpassword } = req.body;
        const result = await userController.ChangePassword(userId, oldpassword, newpassword);
        res.send(result);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
})

module.exports = router;