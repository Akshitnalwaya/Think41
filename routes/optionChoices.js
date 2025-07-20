const express = require('express');
const { OptionChoice, OptionCategory, ProductTemplate, CompatibilityRule } = require('../models');
const { validate, optionChoiceSchema, compatibilityRuleSchema } = require('../utils/validation');

const router = express.Router();

// Create an option choice for a specific category
router.post('/', validate(optionChoiceSchema), async (req, res, next) => {
  try {
    const { category_str_id } = req.query;

    if (!category_str_id) {
      return res.status(400).json({
        success: false,
        error: 'category_str_id query parameter is required'
      });
    }

    // Find the option category
    const optionCategory = await OptionCategory.findOne({
      where: { category_str_id },
      include: [{
        model: ProductTemplate,
        as: 'productTemplate',
        attributes: ['id', 'template_str_id', 'name']
      }]
    });

    if (!optionCategory) {
      return res.status(404).json({
        success: false,
        error: 'Option category not found'
      });
    }

    // Create the option choice
    const optionChoice = await OptionChoice.create({
      ...req.body,
      option_category_id: optionCategory.id
    });

    res.status(201).json({
      success: true,
      message: 'Option choice created successfully',
      data: {
        id: optionChoice.id,
        choice_str_id: optionChoice.choice_str_id,
        name: optionChoice.name,
        description: optionChoice.description,
        price_delta: parseFloat(optionChoice.price_delta),
        is_default: optionChoice.is_default,
        is_available: optionChoice.is_available,
        display_order: optionChoice.display_order,
        option_category_id: optionChoice.option_category_id,
        option_category: {
          id: optionCategory.id,
          category_str_id: optionCategory.category_str_id,
          name: optionCategory.name,
          product_template: optionCategory.productTemplate
        },
        created_at: optionChoice.created_at,
        updated_at: optionChoice.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all option choices for a specific category
router.get('/', async (req, res, next) => {
  try {
    const { category_str_id, include_rules = false } = req.query;

    if (!category_str_id) {
      return res.status(400).json({
        success: false,
        error: 'category_str_id query parameter is required'
      });
    }

    // Find the option category
    const optionCategory = await OptionCategory.findOne({
      where: { category_str_id },
      include: [{
        model: ProductTemplate,
        as: 'productTemplate',
        attributes: ['id', 'template_str_id', 'name']
      }]
    });

    if (!optionCategory) {
      return res.status(404).json({
        success: false,
        error: 'Option category not found'
      });
    }

    const queryOptions = {
      where: { option_category_id: optionCategory.id },
      order: [['display_order', 'ASC'], ['created_at', 'ASC']]
    };

    if (include_rules === 'true') {
      queryOptions.include = [
        {
          model: CompatibilityRule,
          as: 'sourceRules',
          include: [{
            model: OptionChoice,
            as: 'targetChoice',
            attributes: ['id', 'choice_str_id', 'name']
          }]
        },
        {
          model: CompatibilityRule,
          as: 'targetRules',
          include: [{
            model: OptionChoice,
            as: 'sourceChoice',
            attributes: ['id', 'choice_str_id', 'name']
          }]
        }
      ];
    }

    const optionChoices = await OptionChoice.findAll(queryOptions);

    const choices = optionChoices.map(choice => ({
      id: choice.id,
      choice_str_id: choice.choice_str_id,
      name: choice.name,
      description: choice.description,
      price_delta: parseFloat(choice.price_delta),
      is_default: choice.is_default,
      is_available: choice.is_available,
      display_order: choice.display_order,
      option_category_id: choice.option_category_id,
      option_category: {
        id: optionCategory.id,
        category_str_id: optionCategory.category_str_id,
        name: optionCategory.name,
        product_template: optionCategory.productTemplate
      },
      created_at: choice.created_at,
      updated_at: choice.updated_at,
      ...(include_rules === 'true' && {
        compatibility_rules: {
          source_rules: choice.sourceRules || [],
          target_rules: choice.targetRules || []
        }
      })
    }));

    res.json({
      success: true,
      data: choices
    });
  } catch (error) {
    next(error);
  }
});

// Get a specific option choice
router.get('/:choice_str_id', async (req, res, next) => {
  try {
    const { choice_str_id } = req.params;
    const { include_rules = false } = req.query;

    const queryOptions = {
      where: { choice_str_id },
      include: [{
        model: OptionCategory,
        as: 'optionCategory',
        include: [{
          model: ProductTemplate,
          as: 'productTemplate',
          attributes: ['id', 'template_str_id', 'name']
        }]
      }]
    };

    if (include_rules === 'true') {
      queryOptions.include.push(
        {
          model: CompatibilityRule,
          as: 'sourceRules',
          include: [{
            model: OptionChoice,
            as: 'targetChoice',
            attributes: ['id', 'choice_str_id', 'name']
          }]
        },
        {
          model: CompatibilityRule,
          as: 'targetRules',
          include: [{
            model: OptionChoice,
            as: 'sourceChoice',
            attributes: ['id', 'choice_str_id', 'name']
          }]
        }
      );
    }

    const optionChoice = await OptionChoice.findOne(queryOptions);

    if (!optionChoice) {
      return res.status(404).json({
        success: false,
        error: 'Option choice not found'
      });
    }

    const responseData = {
      id: optionChoice.id,
      choice_str_id: optionChoice.choice_str_id,
      name: optionChoice.name,
      description: optionChoice.description,
      price_delta: parseFloat(optionChoice.price_delta),
      is_default: optionChoice.is_default,
      is_available: optionChoice.is_available,
      display_order: optionChoice.display_order,
      option_category_id: optionChoice.option_category_id,
      option_category: optionChoice.optionCategory,
      created_at: optionChoice.created_at,
      updated_at: optionChoice.updated_at,
      ...(include_rules === 'true' && {
        compatibility_rules: {
          source_rules: optionChoice.sourceRules || [],
          target_rules: optionChoice.targetRules || []
        }
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

// Update an option choice
router.put('/:choice_str_id', validate(optionChoiceSchema), async (req, res, next) => {
  try {
    const { choice_str_id } = req.params;

    const [updatedRowsCount] = await OptionChoice.update(req.body, {
      where: { choice_str_id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Option choice not found'
      });
    }

    const updatedChoice = await OptionChoice.findOne({
      where: { choice_str_id },
      include: [{
        model: OptionCategory,
        as: 'optionCategory',
        include: [{
          model: ProductTemplate,
          as: 'productTemplate',
          attributes: ['id', 'template_str_id', 'name']
        }]
      }]
    });

    res.json({
      success: true,
      message: 'Option choice updated successfully',
      data: {
        id: updatedChoice.id,
        choice_str_id: updatedChoice.choice_str_id,
        name: updatedChoice.name,
        description: updatedChoice.description,
        price_delta: parseFloat(updatedChoice.price_delta),
        is_default: updatedChoice.is_default,
        is_available: updatedChoice.is_available,
        display_order: updatedChoice.display_order,
        option_category_id: updatedChoice.option_category_id,
        option_category: updatedChoice.optionCategory,
        created_at: updatedChoice.created_at,
        updated_at: updatedChoice.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete an option choice
router.delete('/:choice_str_id', async (req, res, next) => {
  try {
    const { choice_str_id } = req.params;

    const deletedRowsCount = await OptionChoice.destroy({
      where: { choice_str_id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Option choice not found'
      });
    }

    res.json({
      success: true,
      message: 'Option choice deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Create a compatibility rule between choices
router.post('/:choice_str_id/compatibility-rules', validate(compatibilityRuleSchema), async (req, res, next) => {
  try {
    const { choice_str_id } = req.params;
    const { rule_type, target_choice_str_id, description, priority } = req.body;

    // Find the source choice
    const sourceChoice = await OptionChoice.findOne({
      where: { choice_str_id }
    });

    if (!sourceChoice) {
      return res.status(404).json({
        success: false,
        error: 'Source option choice not found'
      });
    }

    // Find the target choice
    const targetChoice = await OptionChoice.findOne({
      where: { choice_str_id: target_choice_str_id }
    });

    if (!targetChoice) {
      return res.status(404).json({
        success: false,
        error: 'Target option choice not found'
      });
    }

    // Create the compatibility rule
    const compatibilityRule = await CompatibilityRule.create({
      rule_type,
      source_choice_id: sourceChoice.id,
      target_choice_id: targetChoice.id,
      description,
      priority
    });

    res.status(201).json({
      success: true,
      message: 'Compatibility rule created successfully',
      data: {
        id: compatibilityRule.id,
        rule_type: compatibilityRule.rule_type,
        description: compatibilityRule.description,
        priority: compatibilityRule.priority,
        is_active: compatibilityRule.is_active,
        source_choice: {
          id: sourceChoice.id,
          choice_str_id: sourceChoice.choice_str_id,
          name: sourceChoice.name
        },
        target_choice: {
          id: targetChoice.id,
          choice_str_id: targetChoice.choice_str_id,
          name: targetChoice.name
        },
        created_at: compatibilityRule.created_at,
        updated_at: compatibilityRule.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get compatibility rules for a specific choice
router.get('/:choice_str_id/compatibility-rules', async (req, res, next) => {
  try {
    const { choice_str_id } = req.params;

    // Find the choice
    const optionChoice = await OptionChoice.findOne({
      where: { choice_str_id }
    });

    if (!optionChoice) {
      return res.status(404).json({
        success: false,
        error: 'Option choice not found'
      });
    }

    // Get all rules where this choice is involved (as source or target)
    const sourceRules = await CompatibilityRule.findAll({
      where: { source_choice_id: optionChoice.id },
      include: [{
        model: OptionChoice,
        as: 'targetChoice',
        attributes: ['id', 'choice_str_id', 'name']
      }],
      order: [['priority', 'DESC'], ['created_at', 'ASC']]
    });

    const targetRules = await CompatibilityRule.findAll({
      where: { target_choice_id: optionChoice.id },
      include: [{
        model: OptionChoice,
        as: 'sourceChoice',
        attributes: ['id', 'choice_str_id', 'name']
      }],
      order: [['priority', 'DESC'], ['created_at', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        choice: {
          id: optionChoice.id,
          choice_str_id: optionChoice.choice_str_id,
          name: optionChoice.name
        },
        source_rules: sourceRules,
        target_rules: targetRules
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 