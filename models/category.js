module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
      'category',
      {
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        category_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },image: {
            type: DataTypes.STRING, // Store the URL or path of the image
            allowNull: true,
          },}
        ,
        {
            tableName: 'categories',
            timestamps: false,
          }
        );
      
        return Category;
      };