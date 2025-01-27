module.exports = (sequelize, DataTypes) => {
    const InStock = sequelize.define('in_stock', {
      stock_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      instock: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'in_stock',
      timestamps: false
    });
  
    return InStock;
  };