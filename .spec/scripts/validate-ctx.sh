#!/bin/bash

# validate-ctx.sh - Validates module context YAML files
# Usage: ./validate-ctx.sh <context-file.yml>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if file argument is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: No file specified${NC}"
    echo "Usage: $0 <context-file.yml>"
    exit 1
fi

CONTEXT_FILE="$1"

# Check if file exists
if [ ! -f "$CONTEXT_FILE" ]; then
    echo -e "${RED}Error: File does not exist: $CONTEXT_FILE${NC}"
    exit 1
fi

# Check if file is YAML
if [[ ! "$CONTEXT_FILE" =~ \.yml$ ]] && [[ ! "$CONTEXT_FILE" =~ \.yaml$ ]]; then
    echo -e "${YELLOW}Warning: File does not have .yml or .yaml extension${NC}"
fi

echo "📋 Validating: $CONTEXT_FILE"
echo "================================"

ERRORS=0
WARNINGS=0

# Function to check if a field exists in YAML
check_field() {
    local field="$1"
    local required="$2"

    if grep -q "^$field:" "$CONTEXT_FILE" || grep -q "^  $field:" "$CONTEXT_FILE"; then
        echo -e "${GREEN}✓${NC} Field '$field' exists"
        return 0
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}✗${NC} Required field '$field' is missing"
            ((ERRORS++))
        else
            echo -e "${YELLOW}⚠${NC} Optional field '$field' is missing"
            ((WARNINGS++))
        fi
        return 1
    fi
}

# Check required fields
echo ""
echo "📋 Checking required fields..."
check_field "meta" true
check_field "what" true
check_field "use_when" true
check_field "do_not_use_when" true

# Check meta subfields
if grep -q "^meta:" "$CONTEXT_FILE"; then
    echo ""
    echo "📋 Checking meta fields..."

    # Check for target field under meta
    if grep -q "^  target:" "$CONTEXT_FILE"; then
        target=$(grep "^  target:" "$CONTEXT_FILE" | sed 's/.*: *//' | sed 's/ *#.*//')
        echo -e "${GREEN}✓${NC} Field 'meta.target' exists: $target"
    else
        echo -e "${RED}✗${NC} Required field 'meta.target' is missing"
        ((ERRORS++))
    fi

    # Check optional version field
    if grep -q "^  version:" "$CONTEXT_FILE"; then
        version=$(grep "^  version:" "$CONTEXT_FILE" | sed 's/.*: *//')
        if [[ $version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo -e "${GREEN}✓${NC} Version format is valid: $version"
        else
            echo -e "${YELLOW}⚠${NC} Version format might be invalid: $version (expected: x.y.z)"
            ((WARNINGS++))
        fi
    fi
fi

# Check optional fields
echo ""
echo "📋 Checking optional fields..."
check_field "future" false

# Validate array fields have items
echo ""
echo "📋 Checking array fields..."

# Check use_when has items
if grep -q "^use_when:" "$CONTEXT_FILE"; then
    use_count=$(sed -n '/^use_when:/,/^[a-z]/p' "$CONTEXT_FILE" | grep "^  - " | wc -l)
    if [ $use_count -gt 0 ]; then
        echo -e "${GREEN}✓${NC} 'use_when' has $use_count items"
    else
        echo -e "${YELLOW}⚠${NC} 'use_when' exists but has no items"
        ((WARNINGS++))
    fi
fi

# Check do_not_use_when has items
if grep -q "^do_not_use_when:" "$CONTEXT_FILE"; then
    dont_count=$(sed -n '/^do_not_use_when:/,/^[a-z]/p' "$CONTEXT_FILE" | grep "^  - " | wc -l)
    if [ $dont_count -gt 0 ]; then
        echo -e "${GREEN}✓${NC} 'do_not_use_when' has $dont_count items"
    else
        echo -e "${YELLOW}⚠${NC} 'do_not_use_when' exists but has no items"
        ((WARNINGS++))
    fi
fi

# Final summary
echo ""
echo "================================"
echo "📊 Validation Summary"
echo "================================"

if [ $ERRORS -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC} - All validations passed!"
        exit 0
    else
        echo -e "${YELLOW}⚠️ PASSED WITH WARNINGS${NC}"
        echo "  Errors: 0"
        echo "  Warnings: $WARNINGS"
        exit 0
    fi
else
    echo -e "${RED}❌ FAILED${NC}"
    echo "  Errors: $ERRORS"
    echo "  Warnings: $WARNINGS"
    exit 1
fi