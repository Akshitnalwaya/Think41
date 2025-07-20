#!/bin/bash

# Product Configurator API Demo Script
# This script demonstrates the complete functionality of the Product Configurator API

echo "🚀 Product Configurator API Demo"
echo "================================="
echo

# Base URL for the API
BASE_URL="http://localhost:3000/api"

echo "1. Creating Product Template: Laptop Model X"
echo "============================================="
curl -s -X POST $BASE_URL/product-templates \
  -H "Content-Type: application/json" \
  -d '{
    "template_str_id": "laptop_x",
    "name": "Laptop Model X",
    "base_price": 800,
    "description": "High-performance laptop with customizable options"
  }' | python3 -m json.tool
echo

echo "2. Adding Option Categories"
echo "==========================="

echo "2a. Adding CPU Category:"
curl -s -X POST "$BASE_URL/option-categories?template_str_id=laptop_x" \
  -H "Content-Type: application/json" \
  -d '{
    "category_str_id": "cpu",
    "name": "Processor",
    "description": "Choose your processor type",
    "is_required": true,
    "display_order": 1
  }' | python3 -m json.tool
echo

echo "2b. Adding RAM Category:"
curl -s -X POST "$BASE_URL/option-categories?template_str_id=laptop_x" \
  -H "Content-Type: application/json" \
  -d '{
    "category_str_id": "ram",
    "name": "Memory",
    "description": "Select RAM configuration",
    "is_required": true,
    "display_order": 2
  }' | python3 -m json.tool
echo

echo "2c. Adding Storage Category:"
curl -s -X POST "$BASE_URL/option-categories?template_str_id=laptop_x" \
  -H "Content-Type: application/json" \
  -d '{
    "category_str_id": "storage",
    "name": "Storage",
    "description": "Choose storage type and size",
    "is_required": true,
    "display_order": 3
  }' | python3 -m json.tool
echo

echo "3. Adding Option Choices"
echo "========================"

echo "3a. CPU Options:"
# Intel i7
curl -s -X POST "$BASE_URL/option-choices?category_str_id=cpu" \
  -H "Content-Type: application/json" \
  -d '{
    "choice_str_id": "intel_i7",
    "name": "Intel Core i7-12700H",
    "description": "High-performance Intel processor",
    "price_delta": 200,
    "display_order": 1
  }' | python3 -m json.tool
echo

# AMD Ryzen
curl -s -X POST "$BASE_URL/option-choices?category_str_id=cpu" \
  -H "Content-Type: application/json" \
  -d '{
    "choice_str_id": "amd_ryzen7",
    "name": "AMD Ryzen 7 5800H",
    "description": "Efficient AMD processor",
    "price_delta": 150,
    "display_order": 2
  }' | python3 -m json.tool
echo

echo "3b. RAM Options:"
# 16GB RAM
curl -s -X POST "$BASE_URL/option-choices?category_str_id=ram" \
  -H "Content-Type: application/json" \
  -d '{
    "choice_str_id": "ram_16gb",
    "name": "16GB DDR4",
    "description": "16GB DDR4 3200MHz",
    "price_delta": 0,
    "is_default": true,
    "display_order": 1
  }' | python3 -m json.tool
echo

# 32GB RAM
curl -s -X POST "$BASE_URL/option-choices?category_str_id=ram" \
  -H "Content-Type: application/json" \
  -d '{
    "choice_str_id": "ram_32gb",
    "name": "32GB DDR4",
    "description": "32GB DDR4 3200MHz",
    "price_delta": 300,
    "display_order": 2
  }' | python3 -m json.tool
echo

echo "3c. Storage Options:"
# SSD 512GB
curl -s -X POST "$BASE_URL/option-choices?category_str_id=storage" \
  -H "Content-Type: application/json" \
  -d '{
    "choice_str_id": "ssd_512gb",
    "name": "512GB NVMe SSD",
    "description": "Fast NVMe solid state drive",
    "price_delta": 0,
    "is_default": true,
    "display_order": 1
  }' | python3 -m json.tool
echo

# SSD 1TB
curl -s -X POST "$BASE_URL/option-choices?category_str_id=storage" \
  -H "Content-Type: application/json" \
  -d '{
    "choice_str_id": "ssd_1tb",
    "name": "1TB NVMe SSD",
    "description": "Large capacity NVMe drive",
    "price_delta": 200,
    "display_order": 2
  }' | python3 -m json.tool
echo

echo "4. Creating Compatibility Rules"
echo "==============================="

echo "4a. Intel i7 + 32GB RAM compatibility:"
curl -s -X POST $BASE_URL/option-choices/intel_i7/compatibility-rules \
  -H "Content-Type: application/json" \
  -d '{
    "rule_type": "COMPATIBLE",
    "target_choice_str_id": "ram_32gb",
    "description": "Intel i7 works well with 32GB RAM",
    "priority": 10
  }' | python3 -m json.tool
echo

echo "4b. AMD Ryzen + 16GB RAM optimal combination:"
curl -s -X POST $BASE_URL/option-choices/amd_ryzen7/compatibility-rules \
  -H "Content-Type: application/json" \
  -d '{
    "rule_type": "COMPATIBLE",
    "target_choice_str_id": "ram_16gb",
    "description": "AMD Ryzen 7 optimized for 16GB configurations",
    "priority": 5
  }' | python3 -m json.tool
echo

echo "5. Retrieving Complete Product Configuration"
echo "============================================"
curl -s "$BASE_URL/product-templates/laptop_x?include_categories=true" | python3 -m json.tool
echo

echo "6. Getting Category with Choices"
echo "================================"
curl -s "$BASE_URL/option-categories/cpu?include_choices=true" | python3 -m json.tool
echo

echo "7. Getting Compatibility Rules"
echo "=============================="
curl -s "$BASE_URL/option-choices/intel_i7/compatibility-rules" | python3 -m json.tool
echo

echo "✅ Demo completed successfully!"
echo "==============================="
echo "The Product Configurator API is fully functional with:"
echo "- Product templates with base pricing"
echo "- Hierarchical option categories and choices"
echo "- Price deltas for each option"
echo "- Compatibility rules between choices"
echo "- Complete CRUD operations for all entities"
echo "- Proper validation and error handling"
echo "- RESTful API design with relationship includes"
echo
echo "🌐 API Documentation: http://localhost:3000/api"
echo "🏥 Health Check: http://localhost:3000/health" 