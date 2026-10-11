require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/db');
const {
  startCustomerChangeStream,
  closeCustomerChangeStream,
} = require('./services/customerEvents');

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    startCustomerChangeStream();
    app.listen(port, () => console.log(`API listening on port ${port}`));
  } catch (error) {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

process.on('SIGTERM', async () => {
  await closeCustomerChangeStream();
  process.exit(0);
});
