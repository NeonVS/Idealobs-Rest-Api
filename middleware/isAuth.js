const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    if(req.get('Authorization')!=null){
        authHeader=req.get('Authorization');
    }
    if(!req.get('Authorization')){
        authHeader=req.get('authorization');
    }
    console.log(authHeader);
    if(!authHeader){
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'thisisaveryveryverylongandimportantsecret');
    }catch(err){
        console.log(err);
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    req.email = decodedToken.email;
    next();
}