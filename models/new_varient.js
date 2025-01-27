module.exports = (sequelize, DataTypes) => {
    const new_varient = sequelize.define('new_varient_', {
      variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image1: {
        type: DataTypes.STRING,
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
        tableName: 'new_varient_',

    });
  
   
  
    return new_varient;
  };
  