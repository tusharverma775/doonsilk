require("dotenv").config()

const express = require('express');
const cors = require('cors');
const htaccess = require('express-htaccess-middleware');


const app = express()
app.use(cors({
    credentials:true
}));

app.use(htaccess({
    file: __dirname + '/.htaccess'
  }));


require('./models/index')
// const {isAuthorize} = require('./middleware/auth')

app.use(express.json());

const {isAuthorize} = require('./middleware/Auth')


app.use(express.static('public'))

const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'./public/image'))

    },


    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname
        cb(null,name)

    }
})

const filefilter = (req,file,cb)=>{
    (file.mimetype == 'image/jpeg'  ||file.mimetype == 'image/png'  )?
    cb(null,true):cb(null,false)
}
    
 const upload = multer({storage :storage,
    filefilter:filefilter})

    const bodyParser = require('body-parser')
    app.use(bodyParser.json())
   
 var categoryController = require('./controllers/category')
 var productController = require('./controllers/productController')
 var adminController = require('./controllers/adminController')
 var userController = require('./controllers/userController');
const { log } = require("console");



//admin API's
 app.post('/add-categories',upload.single('image'),categoryController.add_categories)
 app.get('/get_category/:category_id',categoryController.get_category)
 app.get('/get_all_categories/',categoryController.get_all_categories)

 
 app.post('/update-categories/',upload.single('image'),categoryController.update_category)
 app.post('/delete_category/',categoryController.delete_category)
 // app.post('/createProduct/:category_id',upload.single('image'),productController.createProduct)
 app.get('/getMainProductById/:product_id',adminController.getMainProductById)

//  app.get('/getProductById/:product_id',productController.getProductById)
 // app.patch('/updateProduct/:product_id',upload.single('image'),productController.updateProduct)
 // app.post('/deleteProduct/:product_id',productController.deleteProduct)
 app.get('/getProductsByCategoryId/:category_id',productController.getProductsByCategoryId)
 app.post('/Admin_signup',adminController.Admin_signup)
 app.get('/Admin_login',adminController.Admin_login)


app.post('/addProductWithVariants', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
  ]), adminController.addProductWithVariants);

  app.post('/addVariant', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 },{name: 'image3', maxCount: 1 }]),
   adminController.addVariant);

   app.post('/updateMainProduct', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
  ]), adminController.updateMainProduct);


  app.get('/getMainProductById',adminController.getMainProductById)
  app.post('/deleteMainProduct',adminController.deleteMainProduct)
  app.get('/getVariantById',adminController.getVariantById)
  app.post('/deleteVariant',adminController.deleteVariant)
  app.post('/updateVariant', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
  ]), adminController.updateVariant);

  app.get('/getAllProducts',adminController.getAllProducts)
  app.post('/addTenderForm',upload.single('file'),adminController.addTenderForm)
  app.get('/getAnnouncementFormById',adminController.getAnnouncementFormById)
  app.post('/deleteAnnouncementForm',adminController.deleteAnnouncementForm)
  app.post('/updateAnnouncementForm',upload.single('file'),adminController.updateAnnouncementForm)
  app.post('/addBanner', upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }]), adminController.addBanner);
  app.get('/getBanner',adminController.getBanner)
  app.post('/updateBanner', upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }]),adminController.updateBanner)
  app.post('/addStockStatus',adminController.addStockStatus)
  app.post('/updateStockStatus',adminController.updateStockStatus)
  app.post('/addImage',upload.single('image'), adminController.addImage)



  

 //userAPI
 app.get('/getAllUsers',adminController.getAllUsers)
 app.get('/getUsersByMonth',adminController.getUsersByMonth)
 app.post('/signupUsers',userController.signupUsers)
 app.post('/verifyOTP/:id',userController.verifyOTP)
 app.post('/savePassword/',userController.savePassword)
 app.post('/loginUser/',userController.loginUser)
 app.post('/addUserDetails/', isAuthorize,userController.addUserDetails)
 app.post('/userLogout/', isAuthorize,userController.userLogout)
 app.post('/changePassword/',userController.changePassword)
 app.post('/searchProduct/',userController.searchProduct)
 app.post('/resendEmail/',userController.resendEmail)
 app.post('/addToCart/',isAuthorize,userController.addToCart)
 app.get('/getUserDetails/',isAuthorize,userController.getUserDetails)
 app.get('/getUserCart/',isAuthorize,userController.getUserCart)
 app.post('/updatePassword/',userController.updatePassword)
 app.post('/updateCartItem/',isAuthorize,userController.updateCartItem)
 app.post('/deleteCartItem/',isAuthorize,userController.deleteCartItem)
 app.post('/addToWishlist/',isAuthorize,userController.addToWishlist)
 app.get('/getWishlist/',isAuthorize,userController.getWishlist)
 app.get('/getRandomProducts/',userController. getRandomProducts)
 app.post('/order/',isAuthorize,userController. order)
 app.get('/getcheckoutProducts',isAuthorize,userController.getcheckoutProducts)



 


 
 






 

 

 

 

 

 

 

 

 

 


 





app.get('/api', (req, res) => {
    res.send(' hello world')
})




const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log('app will running on port 8000 ');
})
