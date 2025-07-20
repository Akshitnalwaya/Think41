const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductTemplate = sequelize.define('ProductTemplate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    template_str_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    base_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'product_templates',
    indexes: [
      {
        unique: true,
        fields: ['template_str_id']
      }
    ]
  });

  ProductTemplate.associate = (models) => {
    ProductTemplate.hasMany(models.OptionCategory, {
      foreignKey: 'product_template_id',
      as: 'optionCategories',
      onDelete: 'CASCADE'
    });
  };

  return ProductTemplate;
}; 