module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('userorder_', {
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      CartItems_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    }, 
  {  tableName: 'userorder_',
    timestamps: true});
  
    return Order;
  };
