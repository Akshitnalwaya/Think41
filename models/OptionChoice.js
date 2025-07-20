const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OptionChoice = sequelize.define('OptionChoice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    choice_str_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price_delta: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        isDecimal: true
      }
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    option_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'option_categories',
        key: 'id'
      }
    }
  }, {
    tableName: 'option_choices',
    indexes: [
      {
        unique: true,
        fields: ['choice_str_id', 'option_category_id']
      },
      {
        fields: ['option_category_id']
      }
    ]
  });

  OptionChoice.associate = (models) => {
    OptionChoice.belongsTo(models.OptionCategory, {
      foreignKey: 'option_category_id',
      as: 'optionCategory'
    });

    // Self-referencing associations for compatibility rules
    OptionChoice.hasMany(models.CompatibilityRule, {
      foreignKey: 'source_choice_id',
      as: 'sourceRules',
      onDelete: 'CASCADE'
    });

    OptionChoice.hasMany(models.CompatibilityRule, {
      foreignKey: 'target_choice_id',
      as: 'targetRules',
      onDelete: 'CASCADE'
    });
  };

  return OptionChoice;
}; 