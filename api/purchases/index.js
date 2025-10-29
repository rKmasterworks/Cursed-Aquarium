const { readData, writeData } = require('../shared/database');

module.exports = async function (context, req) {
  try {
    const data = await readData();

    // GET - Get all purchases
    if (req.method === 'GET') {
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data.purchases || []
      };
      return;
    }

    // POST - Record new purchase
    if (req.method === 'POST') {
      const purchase = {
        ...req.body,
        id: Date.now()
      };
      data.purchases.push(purchase);
      await writeData(data);
      
      context.res = {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true, purchase }
      };
      return;
    }

    context.res = {
      status: 400,
      body: { error: 'Invalid request' }
    };

  } catch (error) {
    context.log.error('Purchases error:', error);
    context.res = {
      status: 500,
      body: { error: 'Server error' }
    };
  }
};
