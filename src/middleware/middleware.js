const jwt = require("jsonwebtoken");




//*********************************************AUTHENTICATION************************************************************************

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "functionUp-plutonium-project-key")
        //req.decodedToken = decodedToken
        if (!decodedToken) {
            return res.status(403).send({ status: false, msg: "token is invalid" });
        }next()
        } catch (err) {
            res.status(500).send({ status: false, msg: err.message })
        }
    }


//*********************************************AUTHORIZATION************************************************************************

const authorization = async function (req, res, next) {
    try {

        let blogId = req.params.blogId
        let decodeToken = jwt.verify(token, "functionUp-plutonium-project-key")
        let userLoggedIn = decodeToken.userId.toString()
        if (blogId) {
        let author = await blog.findById(blogId).select({ authorId: 1, _id: 0 })
        let userToBeModified = author.authorId.toString()
        if (userToBeModified != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
        next()
        } else {
            let authorId = req.query.authorId
            if (authorId != userLoggedIn) return res.status(403).send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
            next()
            
        } 
        
    } catch (err) {
        res.status(500).send({ msg: "ERROR", error: err.message })
    }
}




    module.exports.authorization = authorization
    module.exports.authentication = authentication