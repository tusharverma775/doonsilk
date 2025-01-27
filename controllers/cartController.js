


const add_categories = async (req, res) => {
    try {
      const { category_name } = req.body;
  
      // Check if the category already exists (case-insensitive)
      const existingCategory = await productCategories.findOne({
        where: {
          category_name: {
            [Op.iLike]: category_name, // Case-insensitive search
          },
        },
      });
  
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists.' });
      }
  
      // Create a new category in the database
      const newCategory = await productCategories.create({ category_name });
  
      return res.status(201).json({ message: 'Category created', data: newCategory });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Error creating category.' });
    }
  };
  module.exports={
    add_categories
  }
  