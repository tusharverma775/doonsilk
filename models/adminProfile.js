module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      'adminprofile',
      {
        admin_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        // email: {
        //   type: DataTypes.STRING,
        //   allowNull: false,
        //   unique: true,
        // },
        // phone: {
        //   type: DataTypes.STRING,
        //   allowNull: false,
        // },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        // is_verified: {
        //   type: DataTypes.BOOLEAN,
        //   defaultValue: false,
        // },
        token: {
          type: DataTypes.STRING,
          allowNull: true,
        }},
        {
          timestamps: true,
          tableName: 'adminprofile'

        }
      );
    
      return User;
    };
    