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

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

echo "🗄️  Database Migration Script"
echo "=============================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    print_error "File .env không tồn tại!"
    echo "Vui lòng tạo file .env từ .env.example"
    exit 1
fi

# Check if MySQL is running
if ! docker ps | grep -q phongtro_mysql; then
    print_warning "MySQL container chưa chạy. Đang khởi động..."
    cd ..
    docker-compose up -d mysql
    sleep 5
    cd server
    print_success "MySQL đã khởi động"
fi

# Wait for MySQL to be ready
print_warning "Đang đợi MySQL sẵn sàng..."
sleep 3

# Test connection
print_warning "Kiểm tra kết nối database..."
if mysql -h 127.0.0.1 -P 3306 -u root -proot123 -e "SELECT 1" > /dev/null 2>&1; then
    print_success "Kết nối database thành công!"
else
    print_error "Không thể kết nối database. Kiểm tra lại cấu hình!"
    exit 1
fi

# Run migrations
print_warning "Đang chạy migrations..."
npx sequelize-cli db:migrate

if [ $? -eq 0 ]; then
    print_success "Migrations đã chạy thành công!"
    echo ""
    echo "📊 Kiểm tra tables đã tạo:"
    mysql -h 127.0.0.1 -P 3306 -u root -proot123 phongtro123 -e "SHOW TABLES;"
else
    print_error "Có lỗi khi chạy migrations!"
    exit 1
fi

echo ""
print_success "Hoàn thành!"
