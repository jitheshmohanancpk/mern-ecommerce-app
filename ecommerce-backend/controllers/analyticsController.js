const Product = require('../models/product');

//ഒരു റെക്കമെൻഡേഷൻ ലോജിക് (Category Based)
exports.getRecommendations = async (req, res) => {
  try {
    const { category } = req.query; // യൂസർ നോക്കുന്ന പ്രൊഡക്റ്റിന്റെ കാറ്റഗറി

    // അതേ കാറ്റഗറിയിലുള്ള മറ്റ് 4 പ്രൊഡക്റ്റുകൾ എടുക്കുന്നു
    const recommendedProducts = await Product.find({ 
      category: category 
    }).limit(4);

    res.status(200).json({
      success: true,
      recommendations: recommendedProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};