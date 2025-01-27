
var db = require('../models/index')
var category = db.category
var main_product = db.main_product

// var product = db.product
const { Op } = require('sequelize');



const add_categories = async (req, res) => {
    try {
      const { category_name,  description } = req.body;

  
      // Check if the category already exists (case-insensitive)
      const existingCategory = await category.findOne({
        where: {
          category_name:  category_name
        },
      });
  
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists.' });
      }
  
      // Create a new category in the database
      const newCategory = await category.create({
        category_name,
        description,
      });
  
      return res.status(201).json({ message: 'Category created', data: newCategory });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Error creating category.' });
    }
  };

  
  const get_category = async (req, res) => {
    try {
      const categoryId = req.params.category_id; // Assuming you pass the category ID in the URL parameter "category_id"
  
      // Fetch the category from the database
      const categoryData = await category.findByPk(categoryId);
  
      if (!categoryData) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      // Count the number of products in the category
      const productCount = await main_product.count({ where: { category_id: categoryId } });
  
      return res.status(200).json({ data: categoryData, productCount });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ message: 'Error fetching category.' });
    }
  };


  const get_all_categories = async (req, res) => {
    try {
      // Fetch all categories from the database
      const categories = await category.findAll();
  
      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: 'No categories found.' });
      }
  
      // Fetch the count of products for each category
      const categoryDataWithProductCount = await Promise.all(
        categories.map(async (cat) => {
          const productCount = await main_product.count({ where: { category_id: cat.category_id } });
          return { ...cat.toJSON(), productCount };
        })
      );
      const totalCategories = categories.length;

  
      return res.status(200).json({ totalCategories,data: categoryDataWithProductCount });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Error fetching categories.' });
    }
  };

  const update_category = async (req, res) => {
    try {
      const { category_name, description } = req.body;
      const categoryId = req.body.category_id; 
      const imageUrl = req.file ? req.file.filename : null; 
  
      const existingCategory = await category.findByPk(categoryId);
  
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      await category.update(
        {
          category_name,
          image: imageUrl ? imageUrl : existingCategory.image,
          description,
        },
        {
          where: { category_id: categoryId },
        }
      );
  
      return res.status(200).json({ message: 'Category updated successfully.' });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Error updating category.' });
    }
  };

  const delete_category = async (req, res) => {
    try {
      const categoryId = req.body.category_id; // Assuming you pass the category ID in the URL parameter "id"
  
      // Check if the category exists
      const existingCategory = await category.findByPk(categoryId);
  
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      // Delete the category from the database
      await category.destroy({
        where: { category_id: categoryId },
      });
  
      return res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Error deleting category.' });
    }
  };



  module.exports={
    add_categories,update_category,get_category,delete_category,get_all_categories
  }