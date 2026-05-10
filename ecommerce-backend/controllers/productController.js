const Product = require('../models/product');

// @desc    Get all products (with Search, Filter, Sort)
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const { keyword, category, sort, price } = req.query;

    let query = {};

    // 1. Searching (പേര് വെച്ച് തിരയാൻ)
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    // 2. Category Filtering (കാറ്റഗറി അനുസരിച്ച്)
    if (category) {
      query.category = category;
    }

    // 3. Price Filtering (വിലയുടെ റേഞ്ച് അനുസരിച്ച്)
    // URL-ൽ നിന്ന് വരുന്ന String വാല്യൂസിനെ Number ആക്കി മാറ്റുന്നു
    if (price) {
      query.price = {};
      if (price.gte) query.price.$gte = Number(price.gte);
      if (price.lte) query.price.$lte = Number(price.lte);
      if (price.gt) query.price.$gt = Number(price.gt);
      if (price.lt) query.price.$lt = Number(price.lt);
    }

    // ടെർമിനലിൽ ക്വറി പരിശോധിക്കാൻ (Debugging)
    console.log("Applied Filter Query:", query);

    let apiQuery = Product.find(query);

    // 4. Sorting (ക്രമീകരിക്കാൻ)
    if (sort) {
      // ഉദാഹരണത്തിന്: sort=price അല്ലെങ്കിൽ sort=-price
      const sortBy = sort.split(',').join(' ');
      apiQuery = apiQuery.sort(sortBy);
    } else {
      apiQuery = apiQuery.sort('-createdAt'); // Default: പുതിയത് ആദ്യം
    }

    const products = await apiQuery;

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
// @route   GET /api/products/:id
exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin Only)
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.id; 
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin Only)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin Only)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};