const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OptionCategory = sequelize.define('OptionCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_str_id: {
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
    is_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    product_template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product_templates',
        key: 'id'
      }
    }
  }, {
    tableName: 'option_categories',
    indexes: [
      {
        unique: true,
        fields: ['category_str_id', 'product_template_id']
      },
      {
        fields: ['product_template_id']
      }
    ]
  });

  OptionCategory.associate = (models) => {
    OptionCategory.belongsTo(models.ProductTemplate, {
      foreignKey: 'product_template_id',
      as: 'productTemplate'
    });

    OptionCategory.hasMany(models.OptionChoice, {
      foreignKey: 'option_category_id',
      as: 'optionChoices',
      onDelete: 'CASCADE'
    });
  };

  return OptionCategory;
}; 