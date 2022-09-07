
const jwt = require("jsonwebtoken");


const authentication = async function (req,res,next){
   try{ 
    let token = req.headers["x-Api-key"];
    if (!token) 
        {token = req.headers["x-api-key"]};
    if (!token) 
       { return res.status(403).send({ status: false, msg: "token must be present" })};
  next()}
   catch (error) {
       res.status(500).send({ error: error.message })
   }
    }










    module.exports.authentication=authentication
