module.exports = (sequelize, DataTypes) => {
    const main_product = sequelize.define('main_products_', {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true,

      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,

      },
      image1: {
        type: DataTypes.STRING, // Adjust data type as needed (e.g., BLOB for images)
        allowNull: true,
      },
      image2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      color_hex:{
        type: DataTypes.STRING,
        allowNull: true,
      }
    },{
        tableName: 'main_products_',

    });
    
    return main_product;
  };
  