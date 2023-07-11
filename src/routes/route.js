const router = require("express").Router();



const { signUp, signIn , getUser,modifyUser } = require("../controllers/userController");
const {createProduct,getProductById,getProducts,updateProduct,deleteProduct } = require("../controllers/productController")
const {createCart,getCart,updateCart,deleteCart} = require("../controllers/cartController")
const {createOrder,updateOrder} = require("../controllers/orderController")
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");

router.post("/register", signUp);
router.post("/login", signIn);
router.get("/user/:userId/profile",isAuthorized,isAuthenticated,getUser);
router.put("/user/:userId/profile",isAuthorized,isAuthenticated,modifyUser)

router.post("/products", createProduct)
router.get("/products", getProducts)
router.get("/products/:productId",getProductById)
router.put("/products/:productId", updateProduct)
router.delete("/products/:productId", deleteProduct)

// ===================================== Cart API's ====================================== //


router.post( "/users/:userId/cart" , isAuthenticated , isAuthorized , createCart );
router.get( "/users/:userId/cart" , isAuthenticated , isAuthorized , getCart );
router.put( "/users/:userId/cart" , isAuthenticated , isAuthorized , updateCart );
router.delete( "/users/:userId/cart" , isAuthenticated , isAuthorized , deleteCart );


// ===================================== Order API's ====================================== //


router.post( "/users/:userId/orders", isAuthenticated , isAuthorized , createOrder );
router.put( "/users/:userId/orders" , isAuthenticated , isAuthorized , updateOrder );

// router.all('/*', (req , res) => {
//     res.status(400).send({ status: false, message: " path invalid" });
// });

module.exports = router;
