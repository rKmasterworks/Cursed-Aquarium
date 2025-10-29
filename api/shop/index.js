const { readData, writeData } = require('../shared/database');

module.exports = async function (context, req) {
  const id = context.bindingData.id;

  try {
    const data = await readData();

    // GET - List all shop items
    if (req.method === 'GET') {
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data.shopItems || []
      };
      return;
    }

    // POST - Create new shop item
    if (req.method === 'POST') {
      const item = {
        ...req.body,
        id: Date.now()
      };
      data.shopItems.push(item);
      await writeData(data);
      
      context.res = {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true, item }
      };
      return;
    }

    // DELETE - Remove shop item by ID
    if (req.method === 'DELETE' && id) {
      data.shopItems = data.shopItems.filter(item => item.id !== parseInt(id));
      await writeData(data);
      
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true }
      };
      return;
    }

    context.res = {
      status: 400,
      body: { error: 'Invalid request' }
    };

  } catch (error) {
    context.log.error('Shop error:', error);
    context.res = {
      status: 500,
      body: { error: 'Server error' }
    };
  }
};
