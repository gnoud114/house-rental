#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

echo "🔄 Rollback Migrations"
echo "======================"
echo ""

# Default to rollback 1 migration
STEPS=${1:-1}

print_warning "Đang rollback $STEPS migration(s)..."

npx sequelize-cli db:migrate:undo --to $STEPS

if [ $? -eq 0 ]; then
    print_success "Rollback thành công!"
    echo ""
    echo "📊 Tables hiện tại:"
    mysql -h 127.0.0.1 -P 3306 -u root -proot123 phongtro123 -e "SHOW TABLES;"
else
    echo ""
    print_warning "Có lỗi khi rollback. Có thể đã rollback hết hoặc chưa có migration nào."
fi
