const { readData, writeData } = require('../shared/database');

module.exports = async function (context, req) {
  const role = context.bindingData.role;

  try {
    const data = await readData();

    // PUT - Update password for role
    if (req.method === 'PUT' && role) {
      const { password } = req.body;
      
      if (!password || password.length < 3) {
        context.res = {
          status: 400,
          body: { error: 'Password must be at least 3 characters' }
        };
        return;
      }

      data.passwords[role] = password;
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
    context.log.error('Password error:', error);
    context.res = {
      status: 500,
      body: { error: 'Server error' }
    };
  }
};
