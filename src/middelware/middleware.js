const jwt = require("jsonwebtoken");




//*********************************************AUTHENTICATION************************************************************************

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "functionup-plutonium-project-key")
        //req.decodedToken = decodedToken
        if (!decodedToken) {
            return res.status(403).send({ status: false, msg: "token is invalid" });
        }
        next()
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

//*********************************************AUTHORIZATION************************************************************************

const authorization = function (req, res, next) {
    try {
        let loggedInAuthorId = decodedToken.authorId                                           //req.decodedToken.authorId
        let requestAuthorId = req.params.authorId
        if (requestAuthorId != loggedInAuthorId) {
            return res.status(403).send({ status: false, message: "no permission" })
        }
        next()
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}




module.exports.authorization = authorization
module.exports.authentication = authentication