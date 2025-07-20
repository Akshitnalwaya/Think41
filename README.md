# Product Configurator API

A robust backend API for defining product configuration options and their compatibility rules. Built with Node.js, Express.js, and Sequelize ORM.

## Features

- **Product Templates**: Define base product models with pricing
- **Option Categories**: Create configurable option categories for products (CPU, RAM, Storage, etc.)
- **Option Choices**: Add specific choices within categories with price adjustments
- **Compatibility Rules**: Define dependencies and incompatibilities between choices
- **RESTful API**: Complete CRUD operations for all entities
- **Input Validation**: Comprehensive request validation using Joi
- **Error Handling**: Structured error responses with detailed messages
- **Database Relations**: Proper foreign key relationships and cascading deletes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (easily configurable to PostgreSQL/MySQL)
- **ORM**: Sequelize
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DB_PATH=./database.sqlite
```

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

### 4. Health Check

```bash
curl http://localhost:3000/health
```

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints Overview

Visit `http://localhost:3000/api` for interactive API documentation.

## Data Model

### Entity Relationships

```
ProductTemplate (1) → (N) OptionCategory (1) → (N) OptionChoice
                                                        ↓ (N)
                                                CompatibilityRule
                                                        ↑ (N)
                                               OptionChoice
```

### Core Entities

#### ProductTemplate

- `template_str_id` (unique): String identifier
- `name`: Human-readable name
- `base_price`: Starting price (decimal)
- `description`: Optional description

#### OptionCategory

- `category_str_id` (unique per template): String identifier
- `name`: Category name (e.g., "CPU", "RAM")
- `is_required`: Whether selection is mandatory
- `display_order`: Sort order for UI

#### OptionChoice

- `choice_str_id` (unique per category): String identifier
- `name`: Choice name (e.g., "Intel Core i7")
- `price_delta`: Price adjustment (can be negative)
- `is_default`: Default selection
- `is_available`: Availability status

#### CompatibilityRule

- `rule_type`: REQUIRES | INCOMPATIBLE | COMPATIBLE
- `source_choice_id`: The choice that triggers the rule
- `target_choice_id`: The choice affected by the rule
- `priority`: Rule evaluation priority

## Usage Examples

### 1. Create a Product Template

```bash
curl -X POST http://localhost:3000/api/product-templates \
  -H "Content-Type: application/json" \
  -d '{
    "template_str_id": "laptop_x",
    "name": "Laptop Model X",
    "base_price": 800
  }'
```

### 2. Add Option Category

```bash
curl -X POST "http://localhost:3000/api/option-categories?template_str_id=laptop_x" \
  -H "Content-Type: application/json" \
  -d '{
    "category_str_id": "cpu",
    "name": "Processor"
  }'
```

### 3. Add Option Choices

```bash
# Intel i7 option
curl -X POST "http://localhost:3000/api/option-choices?category_str_id=cpu" \
  -H "Content-Type: application/json" \
  -d '{
    "choice_str_id": "intel_i7",
    "name": "Intel Core i7",
    "price_delta": 150
  }'

# AMD Ryzen option
curl -X POST "http://localhost:3000/api/option-choices?category_str_id=cpu" \
  -H "Content-Type: application/json" \
  -d '{
    "choice_str_id": "amd_ryzen7",
    "name": "AMD Ryzen 7",
    "price_delta": 120
  }'
```

### 4. Create Compatibility Rules

```bash
# Create a requirement rule
curl -X POST http://localhost:3000/api/option-choices/intel_i7/compatibility-rules \
  -H "Content-Type: application/json" \
  -d '{
    "rule_type": "REQUIRES",
    "target_choice_str_id": "motherboard_z",
    "description": "Intel i7 requires Z-series motherboard"
  }'
```

### 5. Query with Relations

```bash
# Get template with all categories and choices
curl "http://localhost:3000/api/product-templates/laptop_x?include_categories=true"

# Get category with all choices and compatibility rules
curl "http://localhost:3000/api/option-categories/cpu?include_choices=true"
```

## Advanced Features

### Compatibility Rules

The system supports three types of compatibility rules:

1. **REQUIRES**: Choice A requires Choice B to be selected

   ```json
   {
     "rule_type": "REQUIRES",
     "source_choice_str_id": "intel_i7",
     "target_choice_str_id": "motherboard_z"
   }
   ```

2. **INCOMPATIBLE**: Choice A cannot be selected with Choice B

   ```json
   {
     "rule_type": "INCOMPATIBLE",
     "source_choice_str_id": "amd_gpu",
     "target_choice_str_id": "intel_cpu"
   }
   ```

3. **COMPATIBLE**: Explicitly mark choices as compatible (for complex rules)
   ```json
   {
     "rule_type": "COMPATIBLE",
     "source_choice_str_id": "nvidia_gpu",
     "target_choice_str_id": "intel_cpu"
   }
   ```

### Query Parameters

Most endpoints support these query parameters:

- `include_categories=true`: Include related option categories
- `include_choices=true`: Include related option choices
- `include_rules=true`: Include compatibility rules
- `page=1&limit=10`: Pagination for list endpoints

### Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": "Validation Error",
  "details": [
    {
      "field": "base_price",
      "message": "base_price must be a positive number",
      "value": -100
    }
  ]
}
```

## Database Schema

The API automatically creates and manages the database schema. Key features:

- **Automatic migrations**: Database schema is created/updated on startup
- **Foreign key constraints**: Proper relational integrity
- **Indexes**: Optimized queries on frequently accessed fields
- **Cascade deletes**: Deleting a template removes all related data

## Development

### Project Structure

```
/
├── package.json
├── server.js              # Application entry point
├── config/
│   └── database.js        # Database configuration
├── models/
│   ├── index.js          # Model initialization
│   ├── ProductTemplate.js
│   ├── OptionCategory.js
│   ├── OptionChoice.js
│   └── CompatibilityRule.js
├── routes/
│   ├── index.js          # Route aggregation
│   ├── productTemplates.js
│   ├── optionCategories.js
│   └── optionChoices.js
├── middleware/
│   └── errorHandler.js    # Global error handling
└── utils/
    └── validation.js      # Input validation schemas
```

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm test           # Run test suite (when implemented)
```

### Database Configuration

The API uses SQLite by default for simplicity, but can be easily configured for PostgreSQL or MySQL by updating `config/database.js`:

```javascript
// For PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  // ... other options
});

// For MySQL
const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "mysql",
  // ... other options
});
```

## Production Considerations

### Environment Variables

- `NODE_ENV=production`
- `PORT=3000`
- `DB_PATH=./database.sqlite` (or database URL for PostgreSQL/MySQL)

### Security

- Rate limiting is enabled (100 requests per 15 minutes per IP)
- Helmet.js provides security headers
- CORS is configurable
- Input validation prevents injection attacks
- Proper error handling prevents information leakage

### Performance

- Database indexes on frequently queried fields
- Configurable pagination for large datasets
- Efficient Sequelize queries with proper includes
- Connection pooling configured

## Future Enhancements

1. **Authentication & Authorization**: JWT-based API authentication
2. **Configuration Validation**: Real-time validation of product configurations
3. **Price Calculation**: Dynamic pricing based on selected options
4. **Configuration Templates**: Pre-defined configuration sets
5. **Audit Logging**: Track all configuration changes
6. **API Versioning**: Support for multiple API versions
7. **Caching**: Redis-based response caching
8. **Testing**: Comprehensive test suite with Jest

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please create an issue in the project repository.
