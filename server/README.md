# Server - Backend API

Node.js + Express backend server for the room rental management system.

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── config.json           # Sequelize configuration
│   │   └── connectDatabase.js    # Database connection
│   │
│   ├── controllers/              # Request handlers
│   │   ├── auth.js              # Authentication
│   │   ├── post.js              # Post management
│   │   ├── user.js              # User management
│   │   ├── category.js          # Categories
│   │   ├── province.js          # Provinces
│   │   ├── price.js             # Price ranges
│   │   ├── area.js              # Area ranges
│   │   └── insert.js            # Data initialization
│   │
│   ├── middlewares/
│   │   └── verifyToken.js       # JWT verification
│   │
│   ├── migrations/               # Database migrations
│   │   ├── create-user.js
│   │   ├── create-post.js
│   │   ├── create-category.js
│   │   └── ...
│   │
│   ├── models/                   # Sequelize models
│   │   ├── index.js             # Model aggregation
│   │   ├── user.js
│   │   ├── post.js
│   │   ├── category.js
│   │   └── ...
│   │
│   ├── routes/                   # API routes
│   │   ├── index.js             # Route aggregation
│   │   ├── auth.js
│   │   ├── post.js
│   │   ├── user.js
│   │   └── ...
│   │
│   ├── services/                 # Business logic
│   │   ├── auth.js
│   │   ├── post.js
│   │   ├── user.js
│   │   └── ...
│   │
│   └── utils/                    # Utility functions
│       ├── common.js            # Common utilities
│       ├── generateCode.js      # Code generation
│       ├── generateDate.js      # Date utilities
│       └── data.js              # Data helpers
│
├── data/                         # Sample data files
│   ├── chothuecanho.json
│   ├── chothuematbang.json
│   ├── chothuephongtro.json
│   └── nhachothue.json
│
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .babelrc                      # Babel configuration
├── .sequelizerc                  # Sequelize CLI config
├── server.js                     # Application entry point
└── package.json                  # Dependencies and scripts
```

## Technologies

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for MySQL
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Babel** - ES6+ transpiler

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 16.x
- **npm** or **yarn**
- **MySQL** >= 8.0

## Installation

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

## Environment Configuration

1. Create a `.env` file in the server root directory:

```bash
cp .env.example .env
```

2. Configure the `.env` file with your settings:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=phongtro123
DB_USER=root
DB_PASSWORD=your_password

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Server Configuration
PORT=5000

# JWT Secret Keys
SECRET_KEY=your_secret_key_here
SECRET_GENERATE=phongtro123

# Pagination
LIMIT=5
```

**Important Configuration Notes:**

- **DB_HOST**: MySQL host (usually `localhost`)
- **DB_PORT**: MySQL port (default: `3306`)
- **DB_NAME**: Database name (must be created in MySQL)
- **DB_USER**: MySQL username
- **DB_PASSWORD**: MySQL password
- **CLIENT_URL**: Frontend URL for CORS policy
- **PORT**: Server port (default: `5000`)
- **SECRET_KEY**: Secret key for JWT token encryption (use a strong random string)
- **SECRET_GENERATE**: Additional secret for generating codes
- **LIMIT**: Number of posts per page for pagination

## Database Setup

### 1. Create Database

First, create the database in MySQL:

```bash
mysql -u root -p
```

In MySQL shell:

```sql
CREATE DATABASE phongtro123;
exit;
```

### 2. Run Migrations

Run Sequelize migrations to create tables:

```bash
npm run migrate
```

This will create the following tables:
- `Users` - User accounts
- `Posts` - Rental posts
- `Categories` - Post categories
- `Provinces` - Location data
- `Prices` - Price ranges
- `Areas` - Area ranges
- `Images` - Post images
- `Attributes` - Post attributes
- `Overviews` - Post overviews
- `Labels` - Post labels

### 3. Check Migration Status

To verify migrations:

```bash
npm run migrate:status
```

### 4. Initialize Reference Data

After migrations, you need to initialize sample data.

**Option 1: Using API (Recommended)**

Start the server first:

```bash
npm start
```

Then call the initialization endpoint:

```bash
curl -X POST http://localhost:5000/api/v1/insert
curl -X POST http://localhost:5000/api/v1/insert/prices-areas
```

**Option 2: Using Postman/Thunder Client**

- Method: `POST`
- URL: `http://localhost:5000/api/v1/insert`
- No body required

- Method: `POST`
- URL: `http://localhost:5000/api/v1/insert/prices-areas`
- No body required

## Running the Server

### Development Mode

```bash
npm start
```

The server will run at `http://localhost:5000` with auto-reload enabled via nodemon.

### Available Scripts

```bash
npm start              # Start development server with nodemon
npm run migrate        # Run database migrations
npm run migrate:undo   # Rollback last migration
npm run migrate:undo:all  # Rollback all migrations
npm run migrate:status # Check migration status
```

## Migration Management

### Rollback Migrations

If you need to undo migrations:

```bash
# Rollback last migration
npm run migrate:undo

# Rollback all migrations
npm run migrate:undo:all
```

### Check Migration Status

```bash
npm run migrate:status
```
