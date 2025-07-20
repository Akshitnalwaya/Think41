const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CompatibilityRule = sequelize.define('CompatibilityRule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rule_type: {
      type: DataTypes.ENUM('REQUIRES', 'INCOMPATIBLE', 'COMPATIBLE'),
      allowNull: false,
      validate: {
        isIn: [['REQUIRES', 'INCOMPATIBLE', 'COMPATIBLE']]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Higher priority rules are evaluated first'
    },
    source_choice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'option_choices',
        key: 'id'
      }
    },
    target_choice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'option_choices',
        key: 'id'
      }
    }
  }, {
    tableName: 'compatibility_rules',
    indexes: [
      {
        unique: true,
        fields: ['source_choice_id', 'target_choice_id', 'rule_type']
      },
      {
        fields: ['source_choice_id']
      },
      {
        fields: ['target_choice_id']
      },
      {
        fields: ['rule_type']
      }
    ],
    validate: {
      // Prevent self-referencing rules
      sourceNotTarget() {
        if (this.source_choice_id === this.target_choice_id) {
          throw new Error('A choice cannot have a compatibility rule with itself');
        }
      }
    }
  });

  CompatibilityRule.associate = (models) => {
    CompatibilityRule.belongsTo(models.OptionChoice, {
      foreignKey: 'source_choice_id',
      as: 'sourceChoice'
    });

    CompatibilityRule.belongsTo(models.OptionChoice, {
      foreignKey: 'target_choice_id',
      as: 'targetChoice'
    });
  };

  return CompatibilityRule;
}; 