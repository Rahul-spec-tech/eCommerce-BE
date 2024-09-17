const Product = require('../model/product');

module.exports.getAllProducts = (req, res) => {
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort === 'desc' ? -1 : 1;

    Product.find()
        .select(['_id', 'title', 'price', 'description', 'image', 'category'])
        .limit(limit)
        .sort({ _id: sort })
        .then(products => res.json(products))
        .catch(err => {
            console.error('Failed to fetch products:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to fetch products' });
        });
};

module.exports.getProduct = (req, res) => {
    const id = req.params.id;
    //console.log('Fetching product with ID:', id);
    Product.findOne({ $or: [{ _id: id }, { id: id }] })
        .select(['_id', 'title', 'price', 'description', 'image', 'category'])
        .then(product => {
            if (!product) {
                console.log('Product not found for ID:', id);
                return res.status(404).json({ status: 'error', message: 'Product not found' });
            }
            res.json(product);
        })
        .catch(err => {
            console.error('Failed to fetch product:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to fetch product' });
        });
};

module.exports.getProductCategories = (req, res) => {
    Product.distinct('category')
        .then(categories => res.json(categories))
        .catch(err => {
            console.error('Failed to fetch categories:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to fetch categories' });
        });
};

module.exports.getProductsInCategory = (req, res) => {
    const category = req.params.category;
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort === 'desc' ? -1 : 1;

    Product.find({ category })
        .select(['_id', 'title', 'price', 'description', 'image'])
        .limit(limit)
        .sort({ _id: sort })
        .then(products => res.json(products))
        .catch(err => {
            console.error('Failed to fetch products in category:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to fetch products in category' });
        });
};

module.exports.addProduct = (req, res) => {
    if (!req.body) {
        return res.status(400).json({ status: 'error', message: 'Data is undefined' });
    }

    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
    });

    product.save()
        .then(newProduct => res.json(newProduct))
        .catch(err => {
            console.error('Failed to add product:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to add product' });
        });
};

module.exports.updateProduct = (req, res) => {
    const id = req.params.id;

    if (!id || !req.body) return res.status(400).json({ status: 'error', message: 'Invalid request' });

    Product.findOneAndUpdate({ _id: id }, req.body, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Product not found' });
            res.json(updatedProduct);
        })
        .catch(err => {
            console.error('Failed to update product:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to update product' });
        });
};

module.exports.deleteProduct = (req, res) => {
    const id = req.params.id;

    if (!id) return res.status(400).json({ status: 'error', message: 'ID is required' });

    Product.findOneAndDelete({ _id: id })
        .then(deletedProduct => {
            if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Product not found' });
            res.json({ status: 'success', message: 'Product deleted successfully' });
        })
        .catch(err => {
            console.error('Failed to delete product:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to delete product' });
        });
};