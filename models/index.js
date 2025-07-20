const { sequelize } = require('../config/database');

// Import model definitions
const ProductTemplate = require('./ProductTemplate')(sequelize);
const OptionCategory = require('./OptionCategory')(sequelize);
const OptionChoice = require('./OptionChoice')(sequelize);
const CompatibilityRule = require('./CompatibilityRule')(sequelize);

// Store models in an object for easy access
const models = {
  ProductTemplate,
  OptionCategory,
  OptionChoice,
  CompatibilityRule,
  sequelize
};

// Initialize associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models; 