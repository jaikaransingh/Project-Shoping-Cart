const router = require("express").Router();



const { signUp, signIn , getUser,modifyUser } = require("../controllers/userController");
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");

router.post("/register", signUp);
router.post("/login", signIn);
router.get("/user/:userId/profile",isAuthorized,isAuthenticated,getUser);
router.put("/user/:userId/profile",isAuthorized,isAuthenticated,modifyUser)


router.all('/*', (req , res) => {
    res.status(400).send({ status: false, message: " path invalid" });
});

module.exports = router;