const Joi = require('joi');

// Product Template validation schemas
const productTemplateSchema = Joi.object({
  template_str_id: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'template_str_id must contain only alphanumeric characters, underscores, and hyphens',
      'string.min': 'template_str_id must be at least 1 character long',
      'string.max': 'template_str_id must be at most 100 characters long',
      'any.required': 'template_str_id is required'
    }),
  name: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'name must be at least 1 character long',
      'string.max': 'name must be at most 255 characters long',
      'any.required': 'name is required'
    }),
  base_price: Joi.number()
    .min(0)
    .precision(2)
    .required()
    .messages({
      'number.min': 'base_price must be a positive number',
      'number.precision': 'base_price must have at most 2 decimal places',
      'any.required': 'base_price is required'
    }),
  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'description must be at most 1000 characters long'
    })
});

// Option Category validation schemas
const optionCategorySchema = Joi.object({
  category_str_id: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'category_str_id must contain only alphanumeric characters, underscores, and hyphens',
      'string.min': 'category_str_id must be at least 1 character long',
      'string.max': 'category_str_id must be at most 100 characters long',
      'any.required': 'category_str_id is required'
    }),
  name: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'name must be at least 1 character long',
      'string.max': 'name must be at most 255 characters long',
      'any.required': 'name is required'
    }),
  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'description must be at most 1000 characters long'
    }),
  is_required: Joi.boolean()
    .optional()
    .default(false),
  display_order: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.integer': 'display_order must be an integer',
      'number.min': 'display_order must be a non-negative number'
    })
});

// Option Choice validation schemas
const optionChoiceSchema = Joi.object({
  choice_str_id: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'choice_str_id must contain only alphanumeric characters, underscores, and hyphens',
      'string.min': 'choice_str_id must be at least 1 character long',
      'string.max': 'choice_str_id must be at most 100 characters long',
      'any.required': 'choice_str_id is required'
    }),
  name: Joi.string()
    .min(1)
    .max(255)
    .required()
    .messages({
      'string.min': 'name must be at least 1 character long',
      'string.max': 'name must be at most 255 characters long',
      'any.required': 'name is required'
    }),
  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'description must be at most 1000 characters long'
    }),
  price_delta: Joi.number()
    .precision(2)
    .optional()
    .default(0)
    .messages({
      'number.precision': 'price_delta must have at most 2 decimal places'
    }),
  is_default: Joi.boolean()
    .optional()
    .default(false),
  is_available: Joi.boolean()
    .optional()
    .default(true),
  display_order: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.integer': 'display_order must be an integer',
      'number.min': 'display_order must be a non-negative number'
    })
});

// Compatibility Rule validation schemas
const compatibilityRuleSchema = Joi.object({
  rule_type: Joi.string()
    .valid('REQUIRES', 'INCOMPATIBLE', 'COMPATIBLE')
    .required()
    .messages({
      'any.only': 'rule_type must be one of: REQUIRES, INCOMPATIBLE, COMPATIBLE',
      'any.required': 'rule_type is required'
    }),
  target_choice_str_id: Joi.string()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'target_choice_str_id must contain only alphanumeric characters, underscores, and hyphens',
      'any.required': 'target_choice_str_id is required'
    }),
  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'description must be at most 1000 characters long'
    }),
  priority: Joi.number()
    .integer()
    .min(0)
    .optional()
    .default(0)
    .messages({
      'number.integer': 'priority must be an integer',
      'number.min': 'priority must be a non-negative number'
    })
});

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      return next(error);
    }
    
    req.body = value;
    next();
  };
};

module.exports = {
  productTemplateSchema,
  optionCategorySchema,
  optionChoiceSchema,
  compatibilityRuleSchema,
  validate
}; 