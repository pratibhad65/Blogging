const authorModel = require('../models/authorModel');
const jwt=require("jsonwebtoken");

const createAuthor = async function(req, res) {
    try {
    let data = req.body;
    let savedData = await authorModel.create(data)
    res.status(201).send( {msg: savedData})
}catch(err){
    res.status(500).send({msg: err.message})
}
}

const loginUser = async function (req, res) {
    try {
      let authorName = req.body.email;
      let password = req.body.password;
  
      let author = await authorModel.findOne({ email: authorName, password: password });
      if (!(authorName && password))
        return res.status(401).send({
          status: false,
          msg: "please enter userName and password"
        });
      if (!author)
        return res.status(401).send({
          status: false,
          msg: "username or the password is not correct",
        });
  
      let token = jwt.sign(
        {
          authorId: author._id.toString(), //////////////// PAYLOAD
          batch: "PLUTONIUM",
          organisation: "FunctionUp",
        },
        "functionup-plutonium-project-key" //// SECRET KEY
      );
      res.setHeader("x-api-key", token);
      res.status(201).send({ status: true, token: token });
    }
  
    catch (error) {
      res.status(500).send({ error: error.message })
    }
  };
module.exports.createAuthor = createAuthor
module.exports.loginAuthor= loginUser

