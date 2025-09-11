const jwt = require('jsonwebtoken')
const JwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  //get the token from request header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send({ error: "access denied,no token provided" })
  }

  try {
    //verify the token
    const data = jwt.verify(token, JwtSecret)

    // Agar token valid hai,
    // to token ke andar se user ki ID nikalega aur use 
    // request object me daal dega taaki aage wala function use istemal kar sake.


    //add user from payload to request object
    req.user = data.user

    next()
  } catch (error) {
    res.status(401).send({ error: "Access denied : Invalid  token" })
  }
}

module.exports = authMiddleware;