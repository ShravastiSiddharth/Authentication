const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Aauthenticatedusersignedin';


const fetchuser = (req,res,next) =>{
    // Taking auth token from header
    const token = req.header('auth_token');
    if (!token){
        res.status(401).send({error : "Please login with valid auth token"})
    }
    try {
        //Verifying token that it is valid or not
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
        
    } catch (error) {
        res.status(401).send({error : "Please login with valid auth token"})
        
    }
}

module.exports = fetchuser