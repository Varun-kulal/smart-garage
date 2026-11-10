# Smart Garage Hub

## 📖 Introduction

**Smart Garage Hub** is an easy-to-use software system made to help mechanics and garage owners run their businesses smoothly. It acts as a central hub where managers, mechanics, and customers can all connect.

The main goal of Smart Garage Hub is to replace old-school paper records and phone calls with a modern, simple online system. It helps you keep track of customer appointments, manage your spare parts inventory, and easily chat with your customers. By bringing everything online, it cuts down on paperwork, reduces mistakes when counting parts, and makes customers much happier because they know exactly what's happening with their cars.

Whether you run a busy garage or you're a car owner waiting for an update, Smart Garage Hub provides the tools you need to make the whole repair process easy and clear.

## 🚀 Key Features

- **Different Accounts for Everyone**: Separate log-ins for Garage Owners (Admins), Mechanics (Staff), and Customers (Users), so everyone only sees what they need to see.
- **Garage Management**: Easily schedule appointments, track repairs, and manage the day-to-day work in the shop.
- **Inventory Tracking**: Keep a real-time list of your spare parts, like tires and oil, so you always know what's in stock.
- **Instant Updates**: Customers get immediate notifications on their phones or computers when their car is ready or if there's an update.
- **Easy-to-Read Dashboards**: Helpful charts and graphs that show the manager how well the business is doing.

## 🛠️ How It's Built

### For the Users (Frontend)
- **Built With**: React 19 and Vite (This makes the website fast).
- **Design**: Tailwind CSS and Framer Motion (This makes the website look modern and smooth).
- **Charts**: Chart.js (Used to draw the business graphs).

### For the Servers (Backend)
- **Server**: Node.js and Express.js (The brain of the operation).
- **Database**: MongoDB (Where all the appointments and user info are saved).
- **Security**: Secure login systems to keep customer data safe.
- **Live Chat/Updates**: Socket.IO (This makes instant notifications work).

## 📁 How the Project is Organized

```text
ai_car_parts/
├── backend/            # The server and database code
├── frontend/           # The website code that users see
└── mongodb_data/       # Where the local database files are saved
```

## ⚙️ How to Start the App

### What You Need First
- Node.js installed on your computer
- MongoDB running

### 1. Start the Database
If you have MongoDB on your computer, you can double-click this file:
```bash
./start-db.bat
```

### 2. Start the Backend Server
Open your terminal and type:
```bash
cd backend
npm install
npm run dev
```

### 3. Start the Website
Open a new terminal window and type:
```bash
cd frontend
npm install
npm run dev
```

## 📝 License
ISC
