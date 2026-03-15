let userController = require('../controllers/users')
let jwt = require('jsonwebtoken')
let fs = require('fs')
let path = require('path')

const pubKeyPath = path.resolve(__dirname, '..', 'public.key')
const publicKey = fs.readFileSync(pubKeyPath, 'utf8')

module.exports = {
  CheckLogin: async function (req, res, next) {
    try {
      console.log('AUTH HEADER:', req.headers.authorization)
      let token = req.headers.authorization
      if (!token || !token.toLowerCase().startsWith('bearer ')) {
        return res.status(403).send({ message: 'ban chua dang nhap' })
      }
      token = token.split(/\s+/)[1]
      let result
      try {
        result = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
      } catch (e) {
        console.error('JWT verify error:', e.message)
        return res.status(403).send({ message: 'ban chua dang nhap' })
      }
      console.log('JWT payload:', result)

      if (!result || !result.id) {
        return res.status(403).send({ message: 'ban chua dang nhap' })
      }

      let getUser = await userController.GetUserById(result.id)
      if (!getUser) {
        return res.status(403).send({ message: 'ban chua dang nhap' })
      }

      req.user = getUser
      next()
    } catch (error) {
      console.error('CheckLogin fatal:', error)
      res.status(403).send({ message: 'ban chua dang nhap' })
    }
  }
}