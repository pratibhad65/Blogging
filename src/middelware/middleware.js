
const jwt = require("jsonwebtoken");


const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) { return res.status(401).send({ status: false, msg: "token must be present" }) };
        next()
    }
    catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const authorization = async function (req, res, next) {
    try {

        let token = req.headers["x-api-key"];
        if (!token) {
            res.status(401).send({ status: false, msg: "token must be present" })
        }
        let decodedToken = jwt.verify(token, "functionup-plutonium-project-key");

        if (!decodedToken)
            return res.status(403).send({ status: false, msg: "token is invalid" });
        let authorId = req.params.authorId;
        let userDetails = await authorModel.findById(authorId);
        if (!userDetails)
            return res.status(404).send({ status: false, msg: "No such user exists" });
            next();
    }
    catch (error) {
        res.status(500).send({ error: error.message })
    }
}







module.exports.authentication = authentication
module.exports.authorization = authorization
