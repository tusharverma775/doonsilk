
var db = require('../models/index')
var Admin = db.admin
var userProfile = db.userProfile
var product = db.product
var productVariant = db.productVariant
var variantImages = db.variantImages
var main_product = db.main_product
var category = db.category
var new_varient = db.new_varient
var tender = db.tender
var notice = db.notice
var announcement = db.announcement
var tenderForm = db.tenderForm
var banner = db.banner
var image = db.image














const sequelize = require('sequelize');

// const {validationResult} = require('express-validator')


// const sendMail = require('../helper/sendMail')
const randomstring = require('randomstring');

const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env


  const generateToken = (userId) => {
    try {
      const token = jwt.sign({ id:userId}, process.env.JWT_SECRET, { expiresIn: '50h' });
      return token;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to generate token');
    }
  };
const saltRounds = 10; 



  const Admin_signup = async (req, res) => {
    try {
      const { name, password } = req.body;

      // Hash the password before storing it in the database
      // const hashedPassword = await bcrypt.hash(password, 10);
      
      const admin = await Admin.create({ name, password: password });

      res.status(201).json({ message: 'Admin created successfully.', data: admin });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ message: 'Error creating admin.' });
    }
  };


  const Admin_login = async (req, res) => {
    try {
      const { name, password } = req.body;
      const admin = await Admin.findOne({ where: { name } });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      if (password !== admin.password) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
      // Create a JWT token and send it to the client upon successful login
      const token = generateToken(admin.admin_id); // Change this according to your token generation logic
  
      // Update the user's token in the database
      admin.token = token; 
      res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error logging in.' });
    }
  };


  const getAllUsers = async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await userProfile.findAll();
  
      return res.status(200).json({ message: 'Users retrieved successfully.', data: users });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ message: 'Error getting users.' });
    }
  };




  const { Op } = require('sequelize');

const getUsersByMonth = async (req, res) => {
  try {
    const { year, month } = req.body; // Assuming you send the year and month in the request body

    // Count the number of users created in the specified year and month
    const userCount = await userProfile.count({
      where: {
        createdAt: {
          [Op.and]: [
            sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), year),
            sequelize.where(sequelize.fn('MONTH', sequelize.col('createdAt')), month),
          ],
        },
      },
    });

    return res.status(200).json({ message: 'User count retrieved successfully.', count: userCount });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ message: 'Error getting user count.' });
  }
};

  
  
const addProductWithVariants = async (req, res) => {
  try {
    const { name, description, category_id, price, discount_percentage, size, color, color_hex } = req.body;
    const images = req.files;

    const existingDescription = await db.category.findOne({
      where: {
        category_id: category_id,
      },
    });

    if (!existingDescription) {
      return res.status(400).json({ message: 'Invalid category_id. Category not found.' });
    }

    // Create the main product
    const newProductData = {
      name,
      description,
      category_id,
      price,
      discount_percentage,
      size,
      color,
      color_hex,
    };

    if (images && images['image1'] && images['image1'][0]) {
      newProductData.image1 = images['image1'][0].filename;
    }
    if (images && images['image2'] && images['image2'][0]) {
      newProductData.image2 = images['image2'][0].filename;
    }
    if (images && images['image3'] && images['image3'][0]) {
      newProductData.image3 = images['image3'][0].filename;
    }

    const newProduct = await db.main_product.create(newProductData);

    res.status(201).json({ message: 'Main product added successfully.', data: newProduct });
  } catch (error) {
    console.error('Error adding main product:', error);
    res.status(500).json({ message: 'Error adding main product.' });
  }
};

const addVariant = async (req, res) => {
  try {
    const { product_id, color, size ,color_hex} = req.body;
    const images = req.files;

    // Check if the provided product_id exists in the main_product table
    const existingProduct = await db.main_product.findByPk(product_id);

    if (!existingProduct) {
      return res.status(400).json({ message: 'Invalid product_id. Main product not found.' });
    }

    // Create the variant
    const newVariant = await db.new_varient.create({
      product_id,
      color,
      size,
      image1: images['image1'][0].filename,
      image2: images['image2'][0].filename,
      image3: images['image3'][0].filename,
      color_hex

    });

    res.status(201).json({ message: 'Variant added successfully.', data: newVariant });
  } catch (error) {
    console.error('Error adding variant:', error);
    res.status(500).json({ message: 'Error adding variant.' });
  }
};


const updateMainProduct = async (req, res) => {
  try {
    const { product_id } = req.body;

    // Check if product_id exists in the table
    const existingProduct = await db.main_product.findByPk(product_id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Main product not foundsw.' });
    }

    const { name, description, category_id, price, discount_percentage, size, color } = req.body;
    const images = req.files;

    const updatedFields = {
      name,
      description,
      category_id,
      price,
      discount_percentage,
      size,
      color,
    };

    // Update image fields if images are provided
    
      if (images && images['image1'] && images['image1'][0]) {
        updatedFields.image1 = images['image1'][0].filename;
      }
      if (images && images['image2'] && images['image2'][0]) {
        updatedFields.image2 = images['image2'][0].filename;
      }
      if (images && images['image3'] && images['image3'][0]) {
        updatedFields.image3 = images['image3'][0].filename;
      }

    const [affectedRows] = await db.main_product.update(updatedFields, {
      where: {
        product_id: product_id,
      },
    });

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Product value is still same no changed found' });
    }

    res.status(200).json({ message: 'Main product updated successfully.' });
  } catch (error) {
    console.error('Error updating main product:', error);
    res.status(500).json({ message: 'Error updating main product.' });
  }
};

const getMainProductById = async (req, res) => {
  try {
    const { product_id } = req.params;

    // Find the main product by product_id along with its variants (using LEFT JOIN)
    const mainProduct = await db.main_product.findOne({
      where: {
        product_id: product_id,
      },
      include: {
        model: db.new_varient, // Assuming your variant model is named "variant"
        where: {
          product_id: product_id,
        },
        required: false, // Use LEFT JOIN to include variants (if available)
      },
    });

    if (!mainProduct) {
      return res.status(404).json({ message: 'Main product not found.' });
    }

    // Calculate the actual price based on the discount percentage
    let actualPrice = mainProduct.price;
    if (mainProduct.discount_percentage) {
      const discountPercentage = mainProduct.discount_percentage;
      actualPrice = mainProduct.price - (mainProduct.price * discountPercentage / 100);
    }

    // Include the calculated actual price in the response
    const response = {
      data: mainProduct,
      actualPrice: actualPrice,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching main product:', error);
    res.status(500).json({ message: 'Error fetching main product.' });
  }
};

const deleteMainProduct = async (req, res) => {
  try {
    const { product_id } = req.body;

    const deletedProduct = await db.main_product.destroy({
      where: {
        product_id: product_id,
      },
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Main product not found.' });
    }

    res.status(200).json({ message: 'Main product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting main product:', error);
    res.status(500).json({ message: 'Error deleting main product.' });
  }
};


const getVariantById = async (req, res) => {
  try {
    const { variant_id } = req.body;

    const variant = await db.new_varient.findByPk(variant_id);

    if (!variant) {
      return res.status(404).json({ message: 'Variant not found.' });
    }

    res.status(200).json({ data: variant });
  } catch (error) {
    console.error('Error fetching variant:', error);
    res.status(500).json({ message: 'Error fetching variant.' });
  }
};

const deleteVariant = async (req, res) => {
  try {
    const { variant_id } = req.body;

    const deletedVariant = await db.new_varient.destroy({
      where: {
        variant_id: variant_id,
      },
    });

    if (!deletedVariant) {
      return res.status(404).json({ message: 'Variant not found.' });
    }

    res.status(200).json({ message: 'Variant deleted successfully.' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    res.status(500).json({ message: 'Error deleting variant.' });
  }
};

const updateVariant = async (req, res) => {
  try {
    const { variant_id } = req.body;
    const { color, size } = req.body;
    const images = req.files;

    // Find the variant by variant_id
    const existingVariant = await db.new_varient.findOne({
      where: {
        variant_id: variant_id,
      },
    });

    if (!existingVariant) {
      return res.status(404).json({ message: 'Variant not found.' });
    }

    // Update variant details
    const updatedVariant = await db.new_varient.update(
      {
        color,
        size,
      },
      {
        where: {
          variant_id: variant_id,
        },
      }
    );

    // Update variant images if provided
    if (images) {
      await db.new_varient.update(
        {
          image1: images['image1'][0].filename,
          image2: images['image2'][0].filename,
          image3: images['image3'][0].filename,
        },
        {
          where: {
            variant_id: variant_id,
          },
        }
      );
    }

    res.status(200).json({ message: 'Variant updated successfully.' });
  } catch (error) {
    console.error('Error updating variant:', error);
    res.status(500).json({ message: 'Error updating variant.' });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await db.main_product.findAll(); 

    res.status(200).json({ data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products.' });
  }
};





const addTenderForm = async (req, res) => {
  try {
    const { criteria, datatype, is_active, text } = req.body;
    let file = null;

    // Handle file upload using Multer if a file is included in the request
    if (req.file) {
      file = req.file.filename;
    }

    // Create a new announcement entry in the database
    const newAnnouncement = await db.tenderForm.create({
      criteria,
      datatype,
      is_active,
      file,
      text,
    });

    res.status(201).json({ message: 'Announcement added successfully.', data: newAnnouncement });
  } catch (error) {
    console.error('Error adding announcement:', error);
    res.status(500).json({ message: 'Error adding announcement.' });
  }
};


const getAnnouncementFormById = async (req, res) => {
  try {
    const announcementForm = await db.tenderForm.findAll({
      
    });

    if (!announcementForm) {
      return res.status(404).json({ message: 'Active announcement form not found.' });
    }

    res.status(200).json({ data: announcementForm });
  } catch (error) {
    console.error('Error fetching announcement form:', error);
    res.status(500).json({ message: 'Error fetching announcement form.' });
  }
};



const updateAnnouncementForm = async (req, res) => {
  try {
    const { id } = req.body;
    const { criteria, datatype, is_active, text } = req.body;

    // Check if the provided ID exists in the database
    const existingAnnouncementForm = await db.tenderForm.findByPk(id);

    if (!existingAnnouncementForm) {
      return res.status(404).json({ message: 'Announcement form not found.' });
    }

    // Update the announcement form data
    await existingAnnouncementForm.update({
      criteria,
      datatype,
      is_active,
      text,
    });

    res.status(200).json({ message: 'Announcement form updated successfully.' });
  } catch (error) {
    console.error('Error updating announcement form:', error);
    res.status(500).json({ message: 'Error updating announcement form.' });
  }
};


const deleteAnnouncementForm = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if the provided ID exists in the database
    const existingAnnouncementForm = await db.tenderForm.findByPk(id);

    if (!existingAnnouncementForm) {
      return res.status(404).json({ message: 'Announcement form not found.' });
    }

    // Delete the announcement form data
    await existingAnnouncementForm.destroy();

    res.status(200).json({ message: 'Announcement form deleted successfully.' });
  } catch (error) {
    console.error('Error deleting announcement form:', error);
    res.status(500).json({ message: 'Error deleting announcement form.' });
  }
};



const addBanner = async (req, res) => {
  try {
    const { image1, image2, image3 } = req.files;

    // Create a new banner entry in the database
    const newBanner = await db.banner.create({
      image1: image1 ? image1[0].filename : null,
      image2: image2 ? image2[0].filename : null,
      image3: image3 ? image3[0].filename : null,
      banner_id:1
    });
    await newBanner.save();


    res.status(201).json({ message: 'Banner added successfully.', data: newBanner });
  } catch (error) {
    console.error('Error adding banner:', error);
    res.status(500).json({ message: 'Error adding banner.' });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { image1, image2, image3 } = req.files;

    // Find the last existing banner with banner_id = 1
    const lastBanner = await db.banner.findOne({
      where: { banner_id: 1 },
      order: [['createdAt', 'DESC']], // Get the last entry based on creation date
    });

    if (!lastBanner) {
      return res.status(404).json({ message: 'No banner found for the specified banner_id.' });
    }

    // Update the images for the last banner
    lastBanner.image1 = image1 ? image1[0].filename : lastBanner.image1;
    lastBanner.image2 = image2 ? image2[0].filename : lastBanner.image2;
    lastBanner.image3 = image3 ? image3[0].filename : lastBanner.image3;

    // Save the changes to the database
    await lastBanner.save();

    res.status(200).json({ message: 'Banner updated successfully.', data: lastBanner });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ message: 'Error updating banner.' });
  }
};



const getBanner = async (req, res) => {
  try {
    const getBanner = await db.banner.findOne({
      where: { banner_id: 1 },
      order: [['createdAt', 'DESC']]
      
    });

    if (!getBanner) {
      return res.status(404).json({ message: 'Active announcement form not found.' });
    }

    res.status(200).json({ data: getBanner });
  } catch (error) {
    console.error('Error fetching getBanner form:', error);
    res.status(500).json({ message: 'Error fetching getBanner form.' });
  }
};


const addStockStatus = async (req, res) => {
  try {
    const { instock, product_id } = req.body;

    const newStockStatus = await db.stock.create({
      instock,
      product_id
    });

    res.status(201).json({ message: 'Stock status added successfully', data: newStockStatus });
  } catch (error) {
    console.error('Error adding stock status:', error);
    res.status(500).json({ message: 'Error adding stock status' });
  }
};

const updateStockStatus = async (req, res) => {
  try {
    const { stock_id } = req.body;
    const { instock, product_id } = req.body;

    const stockStatus = await db.stock.findByPk(stock_id);

    if (!stockStatus) {
      return res.status(404).json({ message: 'Stock status not found' });
    }

    stockStatus.instock = instock;
    stockStatus.product_id = product_id;
    await stockStatus.save();

    res.status(200).json({ message: 'Stock status updated successfully', data: stockStatus });
  } catch (error) {
    console.error('Error updating stock status:', error);
    res.status(500).json({ message: 'Error updating stock status' });
  }
};

const addImage = async(req,res)=>{
  try {
  const image = req.file.filename
  const addImage = await db.image.create({
   image:image
  })
  await addImage.save
  res.status(201).json({ message: 'image added successfully.', data: addImage });
} catch (error) {
  console.error('Error adding image:', error);
  res.status(500).json({ message: 'Error adding image.' });
}

}





  module.exports ={Admin_signup,Admin_login,getAllUsers,getUsersByMonth,addProductWithVariants,addVariant,updateMainProduct,
    getMainProductById,deleteMainProduct,getVariantById,deleteVariant,updateVariant,getAllProducts,addTenderForm,getAnnouncementFormById,
    updateAnnouncementForm,deleteAnnouncementForm,addBanner,getBanner,updateBanner,addStockStatus,updateStockStatus,addImage}
