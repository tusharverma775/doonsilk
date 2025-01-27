module.exports = (sequelize, DataTypes) => {
    const WishlistItem = sequelize.define('wishlistitem', {
      wishlist_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },{
        tableName: 'wishlistitem',
        timestamps: true,
      });
    
  return WishlistItem;
};