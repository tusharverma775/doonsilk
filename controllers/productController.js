
var db = require('../models/index')
// var category = db.category
// var product = db.product
const { Op } = require('sequelize');
var main_product = db.main_product




// const createProduct = async (req, res) => {
//     try {
//         const category_id = req.params.category_id

//       const {
        
//         name,
//         price,
//         discount,
//         any_festival_discount,
//         discountPrice,
//         quantity,
//         colour,
//         size,
//         information,
//         is_featured,
//         is_available,
//       } = req.body;
  
//       // Create the product in the database
//       const newProduct = await product.create({
//         category_id,
//         name,
//         price,
//         discount,
//         any_festival_discount,
//         discountPrice,
//         quantity,
//         colour,
//         size,
//         information,
//         is_featured,
//         is_available,
//         // Add image field if present in the request
//         image: req.file ? req.file.filename : null,
//       });
  
//       return res.status(201).json({ message: 'Product created', data: newProduct });
//     } catch (error) {
//       console.error('Error creating product:', error);
//       res.status(500).json({ message: 'Error creating product.' });
//     }
//   };

  
// const getProductById = async (req, res) => {
//     try {
//       const productId = req.params.product_id; // Assuming you pass the product ID in the URL parameter "productId"
  
//       // Find the product by its ID
//       const foundProduct = await product.findByPk(productId);
  
//       if (!foundProduct) {
//         return res.status(404).json({ message: 'Product not found.' });
//       }
  
//       // Calculate the discounted price using the discount percentage
//       const discountedPrice = foundProduct.price * (1 - foundProduct.discount / 100);
  
//       // Check if any_festival_discount is also not provided
//       if (!foundProduct.any_festival_discount) {
//         // If any_festival_discount is 0, set the discountPrice as the discountedPrice
//         foundProduct.discountPrice = discountedPrice;
//       } else {
//         // If any_festival_discount is available, calculate the discounted price including any_festival_discount
//         foundProduct.discountPrice = discountedPrice * (1 - foundProduct.any_festival_discount / 100);
//       }
  
//       return res.status(200).json({ message: 'Product retrieved successfully.', data: foundProduct });
//     } catch (error) {
//       console.error('Error getting product:', error);
//       res.status(500).json({ message: 'Error getting product.' });
//     }
//   };
  
//   const updateProduct = async (req, res) => {
//     try {
//       const productId = req.params.product_id;
//       const {
//         name,
//         price,
//         discount,
//         any_festival_discount,
//         quantity,
//         colour,
//         size,
//         information,
//         is_featured,
//         is_available,
//       } = req.body;
  
//       // Find the product by its ID
//       const existingProduct = await product.findByPk(productId);
  
//       if (!existingProduct) {
//         return res.status(404).json({ message: 'Product not found.' });
//       }
  
//       // Update the product in the database
//       await existingProduct.update({
//         name,
//         price,
//         discount,
//         any_festival_discount,
//         quantity,
//         colour,
//         size,
//         information,
//         is_featured,
//         is_available,
//         // Add image field if present in the request
//         image: req.file ? req.file.filename : existingProduct.image,
//       });
  
//       return res.status(200).json({ message: 'Product updated successfully.', data: existingProduct });
//     } catch (error) {
//       console.error('Error updating product:', error);
//       res.status(500).json({ message: 'Error updating product.' });
//     }
//   };

//   const deleteProduct = async (req, res) => {
//     try {
//       const productId = req.params.product_id;
  
//       // Find the product by its ID
//       const existingProduct = await product.findByPk(productId);
  
//       if (!existingProduct) {
//         return res.status(404).json({ message: 'Product not found.' });
//       }
  
//       // Delete the product from the database
//       await existingProduct.destroy();
  
//       return res.status(200).json({ message: 'Product deleted successfully.' });
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       res.status(500).json({ message: 'Error deleting product.' });
//     }
//   };
  

  const getProductsByCategoryId = async (req, res) => {
    try {
      const categoryId = req.params.category_id;
  
      // Find all products with the given category ID
      const products = await main_product.findAll({
        where: {
          category_id: categoryId,
        },
      });
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found for the specified category.' });
      }
  
      return res.status(200).json({ message: 'Products retrieved successfully.', data: products });
    } catch (error) {
      console.error('Error getting products by category:', error);
      res.status(500).json({ message: 'Error getting products by category.' });
    }
  };
  

  module.exports={
          getProductsByCategoryId
  }
