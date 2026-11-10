const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables 
dotenv.config();

const app = require('./app');


// MongoDB Connection Option Fallbacks
const dbOptions = {
  // Add recommended config options if required for older mongoose versions
};

console.log('Connecting to MongoDB database...');
mongoose.connect(process.env.MONGO_URI, dbOptions)
  .then(() => {
    console.log('MongoDB connection established successfully!');
    
    // Start listening on server port with graceful conflict handling
    const startServer = (port) => {
      const server = app.listen(port, () => {
        console.log(`Smart Garage Hub Server is running in ${process.env.NODE_ENV} mode on http://localhost:${port}`);
      });
      
      const io = require('./socket').init(server);
      io.on('connection', socket => {
        console.log('Client connected via Socket.IO:', socket.id);
      });
      
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
          startServer(port + 1);
        } else {
          console.error('Server error:', err);
          process.exit(1);
        }
      });
    };
    // Use env PORT or default 5001
    const PORT = process.env.PORT || 5001;
    startServer(PORT);
  })
  .catch((err) => {
    console.error('Database connection failed! Service starting aborted.');
    console.error(err);
    process.exit(1);
  });
