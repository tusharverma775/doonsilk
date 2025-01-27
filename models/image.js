module.exports = (sequelize, DataTypes) => {
    const image = sequelize.define('image', {
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      } },{
        tableName: 'image'
      });
      
    
      return image;
    };
    