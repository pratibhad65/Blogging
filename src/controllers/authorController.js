const authorModel = require('../models/authorModel');
const jwt = require("jsonwebtoken");

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

//***********************************************CREATE AUTHOR****************************************************** */

const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        if(!isValidRequestBody(data)){
            return res.status(400).send({status:false,msg:"invalid"})
          }
            if (!data)return res.status(400).send({status:false,msg:"enter data"})
        
        let { fname, lname, title, email, password } = data
        if (!fname) { return res.status(400).send({ status: false, msg: "fname is required" }) }
        if (!lname) { return res.status(400).send({ status: false, msg: "lname is required" }) }
        if (!title) { return res.status(400).send({ status: false, msg: "title is required" }) }
        if (!email) { return res.status(400).send({ status: false, msg: "email is required" }) }
        if (!password) { return res.status(400).send({ status: false, msg: "password is required" }) }

        if (typeof fname !== "string" || fname[0] == " " || fname[fname.length - 1] == " ") {
            return res.status(400).send({ status: false, msg: "please enter valid fname" })
        }

        if (typeof lname !== "string" || lname[0] == " " || lname[lname.length - 1] == " ") {
            return res.status(400).send({ status: false, msg: "please enter valid lname" })
        }

        if (title !== "Mr" && title !== "Mrs" && title !== "Miss") {
            return res.status(400).send({ status: false, msg: "please enter valid title" })
        }

        let findEmail = await authorModel.findOne({ email: email })
        if (findEmail) {
            return res.status(400).send({ status: false, msg: "email already exist" })
        }
        fname.trim()
        let savedData = await authorModel.create(data)
        res.status(201).send({ msg: savedData })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

//*********************************************************LOGIN USER*******************************************************


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
module.exports.loginAuthor = loginUser

