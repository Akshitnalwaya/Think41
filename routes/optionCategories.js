const express = require('express');
const { OptionCategory, ProductTemplate, OptionChoice } = require('../models');
const { validate, optionCategorySchema } = require('../utils/validation');

const router = express.Router();

// Create an option category for a specific product template
router.post('/', validate(optionCategorySchema), async (req, res, next) => {
  try {
    const { template_str_id } = req.query;

    if (!template_str_id) {
      return res.status(400).json({
        success: false,
        error: 'template_str_id query parameter is required'
      });
    }

    // Find the product template
    const productTemplate = await ProductTemplate.findOne({
      where: { template_str_id }
    });

    if (!productTemplate) {
      return res.status(404).json({
        success: false,
        error: 'Product template not found'
      });
    }

    // Create the option category
    const optionCategory = await OptionCategory.create({
      ...req.body,
      product_template_id: productTemplate.id
    });

    res.status(201).json({
      success: true,
      message: 'Option category created successfully',
      data: {
        id: optionCategory.id,
        category_str_id: optionCategory.category_str_id,
        name: optionCategory.name,
        description: optionCategory.description,
        is_required: optionCategory.is_required,
        display_order: optionCategory.display_order,
        product_template_id: optionCategory.product_template_id,
        created_at: optionCategory.created_at,
        updated_at: optionCategory.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all option categories for a specific product template
router.get('/', async (req, res, next) => {
  try {
    const { template_str_id, include_choices = false } = req.query;

    if (!template_str_id) {
      return res.status(400).json({
        success: false,
        error: 'template_str_id query parameter is required'
      });
    }

    // Find the product template
    const productTemplate = await ProductTemplate.findOne({
      where: { template_str_id }
    });

    if (!productTemplate) {
      return res.status(404).json({
        success: false,
        error: 'Product template not found'
      });
    }

    const queryOptions = {
      where: { product_template_id: productTemplate.id },
      order: [['display_order', 'ASC'], ['created_at', 'ASC']]
    };

    if (include_choices === 'true') {
      queryOptions.include = [{
        model: OptionChoice,
        as: 'optionChoices',
        attributes: ['id', 'choice_str_id', 'name', 'description', 'price_delta', 'is_default', 'is_available', 'display_order'],
        order: [['display_order', 'ASC']]
      }];
    }

    const optionCategories = await OptionCategory.findAll(queryOptions);

    const categories = optionCategories.map(category => ({
      id: category.id,
      category_str_id: category.category_str_id,
      name: category.name,
      description: category.description,
      is_required: category.is_required,
      display_order: category.display_order,
      product_template_id: category.product_template_id,
      created_at: category.created_at,
      updated_at: category.updated_at,
      ...(include_choices === 'true' && { 
        option_choices: category.optionChoices?.map(choice => ({
          ...choice.toJSON(),
          price_delta: parseFloat(choice.price_delta)
        }))
      })
    }));

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// Get a specific option category
router.get('/:category_str_id', async (req, res, next) => {
  try {
    const { category_str_id } = req.params;
    const { include_choices = false } = req.query;

    const queryOptions = {
      where: { category_str_id },
      include: [{
        model: ProductTemplate,
        as: 'productTemplate',
        attributes: ['id', 'template_str_id', 'name']
      }]
    };

    if (include_choices === 'true') {
      queryOptions.include.push({
        model: OptionChoice,
        as: 'optionChoices',
        attributes: ['id', 'choice_str_id', 'name', 'description', 'price_delta', 'is_default', 'is_available', 'display_order'],
        order: [['display_order', 'ASC']]
      });
    }

    const optionCategory = await OptionCategory.findOne(queryOptions);

    if (!optionCategory) {
      return res.status(404).json({
        success: false,
        error: 'Option category not found'
      });
    }

    const responseData = {
      id: optionCategory.id,
      category_str_id: optionCategory.category_str_id,
      name: optionCategory.name,
      description: optionCategory.description,
      is_required: optionCategory.is_required,
      display_order: optionCategory.display_order,
      product_template_id: optionCategory.product_template_id,
      product_template: optionCategory.productTemplate,
      created_at: optionCategory.created_at,
      updated_at: optionCategory.updated_at,
      ...(include_choices === 'true' && { 
        option_choices: optionCategory.optionChoices?.map(choice => ({
          ...choice.toJSON(),
          price_delta: parseFloat(choice.price_delta)
        }))
      })
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
});

// Update an option category
router.put('/:category_str_id', validate(optionCategorySchema), async (req, res, next) => {
  try {
    const { category_str_id } = req.params;

    const [updatedRowsCount] = await OptionCategory.update(req.body, {
      where: { category_str_id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Option category not found'
      });
    }

    const updatedCategory = await OptionCategory.findOne({
      where: { category_str_id },
      include: [{
        model: ProductTemplate,
        as: 'productTemplate',
        attributes: ['id', 'template_str_id', 'name']
      }]
    });

    res.json({
      success: true,
      message: 'Option category updated successfully',
      data: {
        id: updatedCategory.id,
        category_str_id: updatedCategory.category_str_id,
        name: updatedCategory.name,
        description: updatedCategory.description,
        is_required: updatedCategory.is_required,
        display_order: updatedCategory.display_order,
        product_template_id: updatedCategory.product_template_id,
        product_template: updatedCategory.productTemplate,
        created_at: updatedCategory.created_at,
        updated_at: updatedCategory.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete an option category
router.delete('/:category_str_id', async (req, res, next) => {
  try {
    const { category_str_id } = req.params;

    const deletedRowsCount = await OptionCategory.destroy({
      where: { category_str_id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Option category not found'
      });
    }

    res.json({
      success: true,
      message: 'Option category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 