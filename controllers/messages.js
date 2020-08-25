const Message = require('../models/messages');

exports.getMessages = async (req,res,next) => {
    try{
        const doc = await Message.find();
        res.status(200).json({messages:doc});
    }catch(error){
        console.log(error);
        if(!error.statusCode){
            error.statusCode=500;
        }
        return next(error);
    }
}