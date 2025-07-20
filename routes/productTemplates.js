const express = require('express');
const { ProductTemplate, OptionCategory } = require('../models');
const { validate, productTemplateSchema } = require('../utils/validation');

const router = express.Router();

// Create a new product template
router.post('/', validate(productTemplateSchema), async (req, res, next) => {
  try {
    const productTemplate = await ProductTemplate.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product template created successfully',
      data: {
        id: productTemplate.id,
        template_str_id: productTemplate.template_str_id,
        name: productTemplate.name,
        base_price: parseFloat(productTemplate.base_price),
        description: productTemplate.description,
        is_active: productTemplate.is_active,
        created_at: productTemplate.created_at,
        updated_at: productTemplate.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all product templates
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, include_categories = false } = req.query;
    const offset = (page - 1) * limit;

    const queryOptions = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    };

    if (include_categories === 'true') {
      queryOptions.include = [{
        model: OptionCategory,
        as: 'optionCategories',
        attributes: ['id', 'category_str_id', 'name', 'description', 'is_required', 'display_order']
      }];
    }

    const { count, rows } = await ProductTemplate.findAndCountAll(queryOptions);

    const templates = rows.map(template => ({
      id: template.id,
      template_str_id: template.template_str_id,
      name: template.name,
      base_price: parseFloat(template.base_price),
      description: template.description,
      is_active: template.is_active,
      created_at: template.created_at,
      updated_at: template.updated_at,
      ...(include_categories === 'true' && { option_categories: template.optionCategories })
    }));

    res.json({
      success: true,
      data: templates,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / limit),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get a specific product template by template_str_id
router.get('/:template_str_id', async (req, res, next) => {
  try {
    const { template_str_id } = req.params;
    const { include_categories = false } = req.query;

    const queryOptions = {
      where: { template_str_id }
    };

    if (include_categories === 'true') {
      queryOptions.include = [{
        model: OptionCategory,
        as: 'optionCategories',
        attributes: ['id', 'category_str_id', 'name', 'description', 'is_required', 'display_order'],
        order: [['display_order', 'ASC']]
      }];
    }

    const productTemplate = await ProductTemplate.findOne(queryOptions);

    if (!productTemplate) {
      return res.status(404).json({
        success: false,
        error: 'Product template not found'
      });
    }

    const responseData = {
      id: productTemplate.id,
      template_str_id: productTemplate.template_str_id,
      name: productTemplate.name,
      base_price: parseFloat(productTemplate.base_price),
      description: productTemplate.description,
      is_active: productTemplate.is_active,
      created_at: productTemplate.created_at,
      updated_at: productTemplate.updated_at,
      ...(include_categories === 'true' && { option_categories: productTemplate.optionCategories })
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
});

// Update a product template
router.put('/:template_str_id', validate(productTemplateSchema), async (req, res, next) => {
  try {
    const { template_str_id } = req.params;

    const [updatedRowsCount] = await ProductTemplate.update(req.body, {
      where: { template_str_id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product template not found'
      });
    }

    const updatedTemplate = await ProductTemplate.findOne({
      where: { template_str_id }
    });

    res.json({
      success: true,
      message: 'Product template updated successfully',
      data: {
        id: updatedTemplate.id,
        template_str_id: updatedTemplate.template_str_id,
        name: updatedTemplate.name,
        base_price: parseFloat(updatedTemplate.base_price),
        description: updatedTemplate.description,
        is_active: updatedTemplate.is_active,
        created_at: updatedTemplate.created_at,
        updated_at: updatedTemplate.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete a product template
router.delete('/:template_str_id', async (req, res, next) => {
  try {
    const { template_str_id } = req.params;

    const deletedRowsCount = await ProductTemplate.destroy({
      where: { template_str_id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product template not found'
      });
    }

    res.json({
      success: true,
      message: 'Product template deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 