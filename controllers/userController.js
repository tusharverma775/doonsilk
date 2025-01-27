

var db = require('../models/index')
// var category = db.category
var userProfile = db.userProfile
var CartItems = db.cartItem
var wishlist = db.wishlist






const { Op ,Sequelize} = require('sequelize');
const {JWT_SECRET} = process.env
const jwt = require('jsonwebtoken')
var main_product = db.main_product
const FuzzySet = require('fuzzyset');





const sendMail = require('../helper/sendMail')
const randomstring = require('randomstring');
const { log } = require('console');


const generateToken = (user_id) => {
  try {
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET);
    return token;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate token');
  }
};
const saltRounds = 10;



const signupUsers = async (req, res) => {
  const email = req.body.email;
  // Generate a 6-digit OTP
  const otp = randomstring.generate({ length: 6, charset: 'numeric' });

  // Create the email content with the OTP
  const mailSubject = 'OTP for Mail Verification';
  const content = `<p>Your OTP for mail verification is: ${otp}</p>`;

  try {
    // Send the email with the OTP
    await sendMail(email, mailSubject, content);

    // Save the user data with the OTP in the database
    const newUserData = await userProfile.create({
      email: email,
      OTP: otp // Save the OTP to the 'token' field
    });

    const id = newUserData.user_id;
    console.log('New user created:', newUserData.toJSON());
    res.status(201).json({ message: 'User created successfully.', id: id });
  } catch (error) {
    console.error('Error sending email or creating user:', error);
    res.status(500).json({ message: 'Error sending email or creating user.' });
  }
};


const resendEmail = async (req, res) => {
  const email = req.body.email;

  try {
    // Find the user by email
    const user = await userProfile.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate a new 6-digit OTP
    const newOtp = randomstring.generate({ length: 6, charset: 'numeric' });

    // Create the email content with the new OTP
    const mailSubject = 'New OTP for Mail Verification';
    const content = `<p>Your new OTP for mail verification is: ${newOtp}</p>`;

    // Send the email with the new OTP
    await sendMail(email, mailSubject, content);

    // Update the user's OTP in the database
    await user.update({ OTP: newOtp });

    res.status(200).json({ message: 'Email resent successfully with new OTP.' });
  } catch (error) {
    console.error('Error resending email or updating OTP:', error);
    res.status(500).json({ message: 'Error resending email or updating OTP.' });
  }
};

  const verifyOTP = (req, res) => {

   const  user_id = req.params.id
    const { otp } = req.body;
  
    userProfile.findOne({ where: { user_id } })
      .then((existingUser) => {
        if (!existingUser) {
          return res.status(404).json({ message: 'User not found.' });
        }
  
        if (existingUser.OTP === otp) {
      
          existingUser.update({ is_verified: true })
            .then(() => {
              return res.status(200).json({ message: 'OTP is valid. User verified successfully.' });
            })
            .catch((error) => {
              console.error('Error updating user:', error);
              return res.status(500).json({ message: 'Error updating user.' });
            });
        } else {
          return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Error finding user.' });
      });
  };


  async function savePassword(req, res) {
    try {
      const { user_id } = req.body;
      const { password } = req.body;
      console.log(password);
  
      if (!password ) {
        return res.status(400).json({ error: 'Passwords not found' });
      }
  
      // const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await userProfile.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.password = password;
      await user.save();
  
      res.json({ message: 'Password saved successfully' });
    } catch (error) {
      console.error('Error saving password:', error);
      res.status(500).json({ error: 'Failed to save password' });
    }
  }
  


  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await userProfile.findOne({ where: { email: email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Check if the user's email is verified
      if (!user.is_verified) {
        return res.status(401).json({ message: 'Email is not verified. Please verify your email first.' });
      }
  
      console.log(password);
      console.log(user.password);
      // Hash the provided password using SHA-256 (You should use a secure hashing algorithm like bcrypt for passwords)
  
      // Check if the provided password matches the user's hashed password
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
  
      // Generate a new token for the user (change this according to your token generation logic)
      const token = generateToken(user.user_id); // Change this according to your token generation logic
      console.log(user.user_id);
  
      // Update the user's token in the database
      user.token = token;
      await user.save(); // Save the updated user instance to the database
  
      res.status(200).json({ message: 'User logged in successfully.', token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Error logging in user.' });
    }
  };
  

  const addUserDetails = async (req, res) => {
    try {
      // Check for the JWT token in the request header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
      }
  
      // Verify the token and get the user_id from the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user_id;
      console.log(userId);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
  
      // Check if the user exists in the database
      const existingUser = await userProfile.findOne({ where: { user_id: userId } });
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const { name, phone, password, address, pincode, gender } = req.body;
  
  
      // Update the user details in the database
      await userProfile.update(
        {
          name,
          phone,
          password,
          address,
          pincode,
          gender,
        },
        { where: { user_id: userId } }
      );
  
      // Respond with the updated user data
      const updatedUser = await userProfile.findByPk(userId);
      res.status(200).json({
        message: 'User details updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error adding user details:', error);
      res.status(500).json({ error: 'Failed to add user details' });
    }
  };




  const getUserDetails = async (req, res) => {
    try {
      // Check for the JWT token in the request header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
      }
  
      // Verify the token and get the user_id from the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user_id;
      console.log(userId);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
  
      // Retrieve the user details from the database
      const userDetails = await userProfile.findOne({ where: { user_id: userId } });
  
      if (!userDetails) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({
        message: 'User details retrieved successfully',
        user: userDetails,
      });
    } catch (error) {
      console.error('Error retrieving user details:', error);
      res.status(500).json({ error: 'Failed to retrieve user details' });
    }
  };



  const userLogout = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.decode(token);
    const userid = decodedToken.user_id;
  
    // Remove token from user table in the database
    userProfile.update({ token: null }, { where: { user_id: userid } })
      .then(() => {
        res.status(200).json({ message: 'User logged out successfully.' });
      })
      .catch((error) => {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Error logging out user.' });
      });
  };


  const updatePassword = async (req, res) => {
    try {
      const { user_id, oldPassword, newPassword } = req.body;
  
      // Check if the user with the provided ID exists
      const user = await userProfile.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Compare the provided old password with the stored password
      if (user.password !== oldPassword) {
        return res.status(400).json({ message: 'Incorrect old password.' });
      }
  
      // Update the user's password
      await userProfile.update(
        { password: newPassword },
        {
          where: {
            user_id,
          },
        }
      );
  
      return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Error updating password.' });
    }
  };
  
  
 
const changePassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await userProfile.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate a unique identifier (you can use user ID or any other unique field)
    const identifier = user.user_id; // Replace this with the unique identifier

    // Create the link with the unique identifier and the website password reset page route
    const resetLink = `https://yourwebsite.com/reset-password?user=${identifier}`;

    // Create the email content with the reset link
    const mailSubject = 'Reset Password Link';
    const content = `<p>Click the link below to reset your password:<br><a href="${resetLink}">${resetLink}</a></p>`;

    try {
      // Send the email with the reset link
      await sendMail(email, mailSubject, content);

      res.status(200).json({ message: 'Reset password link sent successfully. Please check your email.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email.' });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password.' });
  }
};

const searchProduct = async (req, res) => {
  try {
    const search = req.body.search;

    // Perform related name search (case-insensitive) using raw SQL query
    const relatedProducts = await Product.findAll({
      where: Sequelize.literal(`LOWER(name) LIKE LOWER('%${search}%') AND BINARY name != '${search}'`),
    });

    // Find the initial searched product to get its category
    const initialProduct = await Product.findOne({
      where: Sequelize.literal(`LOWER(name) LIKE LOWER('%${search}%')`),
    });

    if (initialProduct) {
      const categoryId = initialProduct.category_id;

      // Fetch suggestion products with the same category ID
      const suggestionProducts = await Product.findAll({
        where: {
          [Op.and]: [
            { category_id: categoryId }, // Same category criteria
            { product_id: { [Op.not]: initialProduct.product_id } }, // Exclude the initial product
          ],
        },
        limit: 4, // Limit the number of suggestion products
      });

      // Combine the main search results and related products
      const mainProducts = [...relatedProducts].filter(
        (product, index, self) => index === self.findIndex((p) => p.product_id === product.product_id)
      );

      res.status(200).json({ mainProducts, suggestionProducts });
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Error searching products.' });
  }
};


const addToCart = async (req, res) => {
  try {
    // Check for the JWT token in the request header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const { product_id, quantity } = req.body;

    // Retrieve product details from the database based on product_id
    const product = await main_product.findOne({ where: { product_id: product_id } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Calculate price and total_price based on the product and quantity
    const price = product.price;
    const total_price = price * quantity;

    // Create a new cart item in the database
    const newCartItem = await CartItems.create({
      product_id,
      user_id: userId,
      quantity,
      total_price,
    });

    res.status(201).json({ message: 'Product added to cart successfully', cartItem: newCartItem });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

const getUserCart = async (req, res) => {
  try {
    // Check for the JWT token in the request header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Fetch the cart items for the user
    const cartItems = await CartItems.findAll({
      where: { user_id: userId },
      include: { model: main_product }, // Include the related product details
    });

    // Calculate the total price of the cart
    let total_price = 0;
    cartItems.forEach((cartItem) => {
      total_price += cartItem.total_price;
    });

    res.status(200).json({ cartItems, total_price });
  } catch (error) {
    console.error('Error getting user cart:', error);
    res.status(500).json({ error: 'Failed to get user cart' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { CartItems_id, quantity } = req.body;

    // Check for the JWT token in the request header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Retrieve cart item from the database based on cart_item_id and user_id
    const cartItem = await CartItems.findOne({
      where: { CartItems_id, user_id: userId },
    });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Update quantity and total_price based on the new quantity
    const product = await main_product.findOne({ where: { product_id: cartItem.product_id } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const price = product.price;
    const total_price = price * quantity;

    // Update the cart item in the database
    await cartItem.update({
      quantity,
      total_price,
    });

    res.status(200).json({ message: 'Cart item updated successfully', cartItem });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};



const deleteCartItem = async (req, res) => {
  try {
    const { CartItems_id } = req.body;

    // Check for the JWT token in the request header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Retrieve cart item from the database based on cart_item_id and user_id
    const cartItem = await CartItems.findOne({
      where: { CartItems_id, user_id: userId },
    });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Delete the cart item from the database
    await cartItem.destroy();

    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
};




const addToWishlist = async (req, res) => {
  try {
    // Verify the token and get the user_id from the payload
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const { product_id } = req.body;

    // Check if the product is already in the user's wishlist
    const existingItem = await wishlist.findOne({
      where: { user_id: userId, product_id: product_id }
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Product already exists in wishlist.' });
    }

    // Add the product to the user's wishlist
    const newItem = await wishlist.create({
      user_id: userId,
      product_id: product_id
    });

    res.status(201).json({ message: 'Product added to wishlist successfully.', data: newItem });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Error adding to wishlist.' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    // Verify the token and get the user_id from the payload
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const { wishlist_item_id } = req.body;

    // Delete the wishlist item
    const deletedItem = await wishlist.destroy({
      where: { user_id: userId, wishlist_item_id: wishlist_item_id }
    });

    if (!deletedItem) {
      return res.status(404).json({ message: 'Wishlist item not found.' });
    }

    res.status(200).json({ message: 'Wishlist item removed successfully.' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing from wishlist.' });
  }
};

const updateWishlistItem = async (req, res) => {
  try {
    // Verify the token and get the user_id from the payload
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const { wishlist_item_id } = req.body;
    const { product_id } = req.body;

    // Update the wishlist item's product_id
    const updatedItem = await wishlist.update(
      { product_id: product_id },
      { where: { user_id: userId, wishlist_item_id: wishlist_item_id } }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Wishlist item not found.' });
    }

    res.status(200).json({ message: 'Wishlist item updated successfully.' });
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    res.status(500).json({ message: 'Error updating wishlist item.' });
  }
};

const getWishlist = async (req, res) => {
  try {
    // Verify the token and get the user_id from the payload
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    // Get the user's wishlist items
    const wishlistItems = await wishlist.findAll({
      where: { user_id: userId },
      include: [{ model: db.main_product, as: 'product' }] // Include the associated product details
    });

    res.status(200).json({ data: wishlistItems });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist.' });
  }
};


const getrandomroductById = async (req, res) => {
  try {

    // Find the main product by product_id along with its variants (using LEFT JOIN)
    const mainProduct = await db.main_product.findAll({
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


const getRandomProducts = async (req, res) => {
  try {
    const randomProducts = await db.main_product.findAll({
      include: {
        model: db.new_varient, 
        required: false, 
      },
      order: db.Sequelize.literal('RAND()'), // Order by random
      limit: 3, // Limit to three results
    });

    if (!randomProducts || randomProducts.length === 0) {
      return res.status(404).json({ message: 'No random products found.' });
    }

    // Calculate the actual price based on the discount percentage for each product
    const productsWithActualPrice = randomProducts.map(product => {
      let actualPrice = product.price;
      if (product.discount_percentage) {
        const discountPercentage = product.discount_percentage;
        actualPrice = product.price - (product.price * discountPercentage / 100);
      }
      return {
        ...product.toJSON(),
        actualPrice: actualPrice,
      };
    });

    res.status(200).json(productsWithActualPrice);
  } catch (error) {
    console.error('Error fetching random products:', error);
    res.status(500).json({ message: 'Error fetching random products.' });
  }
};
const sendorderMail = require('../helper/orderSendMail')


const order = async (req, res) => {
  try {

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Verify the token and get the user_id from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    const {
      phone,
      shippingAddress,
      name,
      address,
      city,
      country,
      state,
      postalCode,
      quantity,
   
      
    } = req.body;

    // Check if user_id exists
    const user = await db.userProfile.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
   const email = user.email; 
    // Create a new order in the database
    const newOrder = await db.orders.create({
      phone,
      shippingAddress,
      name,
      address,
      city,
      country,
      state,
      postalCode,
      user_id: userId, // Use lowercase user_id
      quantity,
  
    });
    await CartItems.destroy({
      where: {
        user_id: userId,
      },
    });


    const mailSubject = 'New Order Placed'; // No need for `const` keyword here
    const content = `A new order has been placed with the following details:\n\n
             User ID: ${userId}\n
             Quantity: ${quantity}\n
             `;
      await sendorderMail(email, mailSubject, content);

    // Send email notification to admin
  ;

    res.status(201).json({ message: 'Order confirmed successfully', data: newOrder });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ message: 'Error confirming order' });
  }
};


const getcheckoutProducts = async (req, res) => {
  try {
    // Get the user ID from the token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    console.log(userId);
    const cartItems = await CartItems.findAll({
      where: {
        user_id: userId,
      },
      include: {
       model: main_product ,
       attributes: ['product_id', 'name', 'price'],  
      },
    });

    res.status(200).json({ data: cartItems });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Error fetching cart items' });
  }
};






  module.exports = { signupUsers,verifyOTP,resendEmail,savePassword,addUserDetails,getUserDetails,loginUser,userLogout,changePassword,
    searchProduct,addToCart,
  addToWishlist,removeFromWishlist,getWishlist,updateWishlistItem,
  getUserCart,updatePassword,updateCartItem,deleteCartItem,getrandomroductById,getRandomProducts,order,getcheckoutProducts};

