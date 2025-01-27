const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
   host: process.env.MYSQL_HOST,
   logging:false,
   dialect: 'mysql',
 });
// const sequelize = new Sequelize('sql6636217', 'sql6636217', 'qsIXCR9U5q', {
//   host: 'sql6.freesqldatabase.com',
//   logging:false,
//   dialect: 'mysql',
// });

//const sequelize = new Sequelize('newsilkecommecre', 'root', 'cprakhar999@gmail.com', {
  //host: 'localhost',
  //logging:false,
  //dialect: 'mysql',
  // operatorsAliases: false,

//});

// const sequelize = new Sequelize('Database-1', 'dbmasteruser', '05fzJZcepiwlf3,A,6mQ}cM0.&a*[1bi', {
//   host: 'ls-fa310113994b9814904f35c6ec62956753e63a01.c8mpioyjghq2.ap-south-1.rds.amazonaws.com',
//   logging:false,
//   dialect: 'mysql',
//   // operatorsAliases: false,

// });

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  
  const db = {}
  db.Sequelize=Sequelize
  db.sequelize = sequelize
  db.category = require('./category')(sequelize,DataTypes)
  db.admin = require('./adminProfile')(sequelize,DataTypes)
  db.userProfile = require('./userProfile')(sequelize,DataTypes)
  db.cartItem = require('./cartItem')(sequelize,DataTypes)

  db.main_product = require('./newProduct')(sequelize,DataTypes)
  db.new_varient = require('./new_varient')(sequelize,DataTypes)


  db.tenderForm = require('./tenderForm')(sequelize,DataTypes)
  db.banner = require('./banner')(sequelize,DataTypes)
  db.wishlist = require('./wishlist')(sequelize,DataTypes)
  db.stock = require('./stock')(sequelize,DataTypes)
  db.orders = require('./orders')(sequelize,DataTypes)
  db.image = require('./image')(sequelize,DataTypes)






  db.userProfile.hasMany( db.cartItem,{foreignKey:'user_id'})
  db.cartItem.belongsTo(db.userProfile,{ foreignKey: 'user_id' })


  db.category.hasMany( db.main_product,{foreignKey:'category_id'})
  db.main_product.belongsTo(db.category,{ foreignKey: 'category_id' })

  db.main_product.hasMany( db.new_varient,{foreignKey:'product_id'})
  db.new_varient.belongsTo(db.main_product,{ foreignKey: 'product_id' })

  db.main_product.hasMany( db.cartItem,{foreignKey:'product_id'})
  db.cartItem.belongsTo(db.main_product,{ foreignKey: 'product_id' })

  db.main_product.hasMany( db.stock,{foreignKey:'product_id'})
  db.stock.belongsTo(db.main_product,{ foreignKey: 'product_id' })

  db.main_product.hasMany( db.orders,{foreignKey:'product_id'})
  db.orders.belongsTo(db.main_product,{ foreignKey: 'product_id' })

  db.userProfile.hasMany( db.orders,{foreignKey:'user_id'})
  db.orders.belongsTo(db.userProfile,{ foreignKey: 'user_id' })


 db.cartItem.hasMany( db.orders,{foreignKey:'CartItems_id'})
  db.orders.belongsTo(db.cartItem,{ foreignKey: 'CartItems_id' })
  
  sequelize.sync({force:false})
  module.exports = db
