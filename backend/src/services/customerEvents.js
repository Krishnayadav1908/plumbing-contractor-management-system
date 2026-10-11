const Customer = require('../models/customerModel');

const clients = new Set();
let changeStream;

const startCustomerChangeStream = () => {
  changeStream = Customer.watch([], { fullDocument: 'updateLookup' });
  changeStream.on('change', (change) => {
    const message = `data: ${JSON.stringify({
      operationType: change.operationType,
      customerId: change.documentKey?._id,
    })}\n\n`;

    for (const client of clients) client.write(message);
  });
  changeStream.on('error', (error) => {
    console.error(`Customer change stream error: ${error.message}`);
  });
};

const subscribeToCustomerEvents = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write(': connected\n\n');

  clients.add(res);
  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
};

const closeCustomerChangeStream = async () => {
  if (changeStream) await changeStream.close();
};

module.exports = {
  startCustomerChangeStream,
  subscribeToCustomerEvents,
  closeCustomerChangeStream,
};
