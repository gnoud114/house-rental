# Client - Frontend Application

React + Vite frontend application for the room rental management system.

## Technologies

- **React** 19.x - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **Redux** - State management
- **Redux Persist** - Persist Redux state
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **SweetAlert2** - Alert/notification dialogs
- **Moment.js** - Date/time formatting

## Project Structure

```
client/
├── public/
│   ├── index.html              # HTML template
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # SEO robots file
│
├── src/
│   ├── assets/
│   │   └── provinces.json      # Province data
│   │
│   ├── components/             # Reusable components
│   │   ├── Address.jsx         # Address display
│   │   ├── Button.jsx          # Custom button
│   │   ├── Contact.jsx         # Contact information
│   │   ├── InputForm.jsx       # Form input
│   │   ├── InputFormV2.jsx     # Enhanced form input
│   │   ├── InputReadOnly.jsx   # Read-only input
│   │   ├── Intro.jsx           # Introduction section
│   │   ├── Item.jsx            # Post item card
│   │   ├── ItemSidebar.jsx     # Sidebar item
│   │   ├── Loading.jsx         # Loading spinner
│   │   ├── Modal.jsx           # Modal dialog
│   │   ├── Overview.jsx        # Post overview
│   │   ├── PageNumber.jsx      # Pagination
│   │   ├── Province.jsx        # Province selector
│   │   ├── ProvinceBtn.jsx     # Province button
│   │   ├── RelatedPost.jsx     # Related posts
│   │   ├── SearchItem.jsx      # Search result item
│   │   ├── Select.jsx          # Custom select
│   │   ├── Sitem.jsx           # Sidebar item
│   │   ├── User.jsx            # User profile
│   │   └── index.jsx           # Component exports
│   │
│   ├── containers/
│   │   ├── Public/             # Public pages
│   │   │   ├── Home.jsx        # Home page
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx    # Register page
│   │   │   ├── DetailPost.jsx  # Post detail
│   │   │   ├── Rental.jsx      # Rental listing
│   │   │   └── ...
│   │   │
│   │   └── System/             # Protected pages
│   │       ├── CreatePost.jsx  # Create new post
│   │       ├── ManagePost.jsx  # Manage user posts
│   │       ├── EditAccount.jsx # Edit profile
│   │       └── ...
│   │
│   ├── services/               # API services
│   │   ├── app.jsx             # App-related APIs
│   │   ├── auth.jsx            # Authentication APIs
│   │   ├── category.jsx        # Category APIs
│   │   ├── post.jsx            # Post APIs
│   │   ├── user.jsx            # User APIs
│   │   └── index.jsx           # Service exports
│   │
│   ├── store/
│   │   ├── actions/            # Redux actions
│   │   │   ├── actionTypes.js  # Action type constants
│   │   │   ├── app.js          # App actions
│   │   │   ├── auth.js         # Auth actions
│   │   │   └── post.js         # Post actions
│   │   │
│   │   └── reducers/           # Redux reducers
│   │       ├── appReducer.js   # App state
│   │       ├── authReducer.js  # Auth state
│   │       ├── postReducer.js  # Post state
│   │       └── rootReducer.js  # Combined reducers
│   │
│   ├── utils/                  # Utility functions
│   │   ├── constant.jsx        # Constants
│   │   ├── dataContact.jsx     # Contact data
│   │   ├── dataIntro.jsx       # Intro data
│   │   ├── icons.jsx           # Icon exports
│   │   ├── menuManage.jsx      # Management menu
│   │   ├── menuSidebar.jsx     # Sidebar menu
│   │   └── Common/             # Common utilities
│   │
│   ├── App.jsx                 # Root component
│   ├── App.css                 # App styles
│   ├── main.jsx                # Entry point
│   ├── index.css               # Global styles
│   ├── redux.js                # Redux store config
│   └── axiosConfig.jsx         # Axios configuration
│
├── .gitignore                  # Git ignore rules
├── eslint.config.js            # ESLint configuration
├── index.html                  # Entry HTML
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 16.x
- **npm** or **yarn**

## Installation

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

## Environment Configuration

The application connects to the backend API. By default, it expects the API at `http://localhost:5000`.

### Configure API Base URL

Edit the [src/axiosConfig.jsx](src/axiosConfig.jsx) file to set your API base URL:

```javascript
const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1'
});
```

Change `http://localhost:5000` if your backend runs on a different host/port.

### CORS Configuration

Ensure the backend's `.env` file has the correct `CLIENT_URL`:

```env
CLIENT_URL=http://localhost:5173
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will run at `http://localhost:5173` with hot module replacement (HMR).

### Development with Network Access

To access the app from other devices on your network:

```bash
npm run dev-expose
```

This will expose the dev server on your network IP address.

### Available Scripts

```bash
npm run dev          # Start development server
npm run dev-expose   # Start dev server with network access
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Build for Production

### 1. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 2. Preview Production Build

```bash
npm run preview
```

### 3. Deploy

Deploy the contents of the `dist/` directory to your hosting service (Vercel, Netlify, AWS S3, etc.).

## Features

### Public Features

- **Home Page**: Browse latest rental posts
- **Search & Filter**: Filter by category, location, price, area
- **Post Details**: View detailed information about rentals
- **Authentication**: Register and login
- **Responsive Design**: Mobile-friendly interface

### User Features (Authenticated)

- **Create Post**: Add new rental listings
- **Manage Posts**: View, edit, and delete your posts
- **Edit Profile**: Update user information
- **Save Favorites**: Bookmark interesting posts
