const { readData } = require('../shared/database');

module.exports = async function (context, req) {
  context.log('Login attempt');

  if (req.method !== 'POST') {
    context.res = {
      status: 405,
      body: { error: 'Method not allowed' }
    };
    return;
  }

  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      context.res = {
        status: 400,
        body: { error: 'Username and password required' }
      };
      return;
    }

    const data = await readData();

    if (data.passwords[username] && data.passwords[username] === password) {
      // Main DPS always has admin access
      const isMainDPS = username === 'main dps';
      // Check permissions for other roles
      const hasPermission = data.permissions && data.permissions[username];
      
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: true,
          user: {
            username,
            role: username,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            hasAdminAccess: isMainDPS || hasPermission
          }
        }
      };
    } else {
      context.res = {
        status: 401,
        body: { success: false, error: 'Invalid credentials' }
      };
    }
  } catch (error) {
    context.log.error('Login error:', error);
    context.res = {
      status: 500,
      body: { error: 'Server error' }
    };
  }
};
