module.exports = (sequelize, DataTypes) => {
  const Addbanners = sequelize.define('addbanners', {
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
    banner_id:{
      type: DataTypes.INTEGER,
      allowNull: true,

    }
  },{
    tableName: 'addbanners'
  });

  return Addbanners;
};
