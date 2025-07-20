const express = require('express');
const productTemplatesRouter = require('./productTemplates');
const optionCategoriesRouter = require('./optionCategories');
const optionChoicesRouter = require('./optionChoices');

const router = express.Router();

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Product Configurator API',
    version: '1.0.0',
    endpoints: {
      product_templates: {
        base_url: '/api/product-templates',
        endpoints: [
          'POST / - Create a product template',
          'GET / - Get all product templates',
          'GET /:template_str_id - Get a specific product template',
          'PUT /:template_str_id - Update a product template',
          'DELETE /:template_str_id - Delete a product template'
        ]
      },
      option_categories: {
        base_url: '/api/option-categories',
        endpoints: [
          'POST /?template_str_id=<id> - Create an option category',
          'GET /?template_str_id=<id> - Get option categories for a template',
          'GET /:category_str_id - Get a specific option category',
          'PUT /:category_str_id - Update an option category',
          'DELETE /:category_str_id - Delete an option category'
        ]
      },
      option_choices: {
        base_url: '/api/option-choices',
        endpoints: [
          'POST /?category_str_id=<id> - Create an option choice',
          'GET /?category_str_id=<id> - Get option choices for a category',
          'GET /:choice_str_id - Get a specific option choice',
          'PUT /:choice_str_id - Update an option choice',
          'DELETE /:choice_str_id - Delete an option choice',
          'POST /:choice_str_id/compatibility-rules - Create a compatibility rule',
          'GET /:choice_str_id/compatibility-rules - Get compatibility rules for a choice'
        ]
      }
    },
    examples: {
      create_product_template: {
        method: 'POST',
        url: '/api/product-templates',
        body: {
          template_str_id: 'laptop_x',
          name: 'Laptop Model X',
          base_price: 800
        }
      },
      create_option_category: {
        method: 'POST',
        url: '/api/option-categories?template_str_id=laptop_x',
        body: {
          category_str_id: 'cpu',
          name: 'Processor'
        }
      },
      create_option_choice: {
        method: 'POST',
        url: '/api/option-choices?category_str_id=cpu',
        body: {
          choice_str_id: 'intel_i7',
          name: 'Intel Core i7',
          price_delta: 150
        }
      }
    }
  });
});

// Mount routers
router.use('/product-templates', productTemplatesRouter);
router.use('/option-categories', optionCategoriesRouter);
router.use('/option-choices', optionChoicesRouter);

module.exports = router; 