const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const accessToken = req.cookies.access_token;
    
    if (!accessToken) {
      console.log('No Cookie Found');
      return res.status(401).send('access denied');
    }
  
    try {
      const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      console.log(err);
      res.status(400).send('Invalid Token');
    }
  
}

module.exports = authenticateToken;