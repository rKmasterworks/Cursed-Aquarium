const { readData, writeData } = require('../shared/database');

module.exports = async function (context, req) {
  const role = context.bindingData.role;

  try {
    const data = await readData();

    // GET - Get all permissions
    if (req.method === 'GET' && !role) {
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data.permissions || {}
      };
      return;
    }

    // PUT - Update role permission
    if (req.method === 'PUT' && role) {
      const { hasAccess } = req.body;
      
      // Main DPS always has admin access - cannot be changed
      if (role === 'main dps') {
        context.res = {
          status: 403,
          body: { error: 'Cannot modify Main DPS permissions' }
        };
        return;
      }
      
      if (!data.permissions) {
        data.permissions = {};
      }
      
      data.permissions[role] = hasAccess;
      await writeData(data);
      
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true, permissions: data.permissions }
      };
      return;
    }

    context.res = {
      status: 400,
      body: { error: 'Invalid request' }
    };

  } catch (error) {
    context.log.error('Permissions error:', error);
    context.res = {
      status: 500,
      body: { error: 'Server error' }
    };
  }
};
