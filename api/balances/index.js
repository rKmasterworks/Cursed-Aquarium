const { readData, writeData } = require('../shared/database');

module.exports = async function (context, req) {
  const role = context.bindingData.role;

  try {
    const data = await readData();

    // GET - Get all balances
    if (req.method === 'GET' && !role) {
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data.balances || {}
      };
      return;
    }

    // GET - Get specific role balance
    if (req.method === 'GET' && role) {
      const balance = data.balances[role] !== undefined ? data.balances[role] : 0;
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { balance }
      };
      return;
    }

    // PUT - Update role balance
    if (req.method === 'PUT' && role) {
      const { balance } = req.body;
      
      if (balance === undefined) {
        context.res = {
          status: 400,
          body: { error: 'Balance required' }
        };
        return;
      }

      data.balances[role] = balance;
      await writeData(data);
      
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true, balances: data.balances }
      };
      return;
    }

    context.res = {
      status: 400,
      body: { error: 'Invalid request' }
    };

  } catch (error) {
    context.log.error('Balances error:', error);
    context.res = {
      status: 500,
      body: { error: 'Server error' }
    };
  }
};
