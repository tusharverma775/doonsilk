module.exports = (sequelize, DataTypes) => {
    const tenderForm = sequelize.define('tenderForm', {
      criteria: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      datatype: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      file: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },{
        tableName: 'tenderForm'
      });
  
    return tenderForm;
  };
  