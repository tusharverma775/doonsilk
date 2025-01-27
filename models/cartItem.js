module.exports = (sequelize, DataTypes) => {
    const userCart = sequelize.define(
      'usercart_',
      {
        CartItems_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
       
        total_price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
     
      },
      {
        tableName: 'usercart_',
      }
    );
  
    return userCart;
  };