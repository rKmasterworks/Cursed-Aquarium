const { readData, writeData } = require('../shared/database');

module.exports = async function (context, req) {
  try {
    const data = await readData();

    // GET - Get full roster
    if (req.method === 'GET') {
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data.roster || { tank: [], dps: [], support: [] }
      };
      return;
    }

    // POST - Add player to roster
    if (req.method === 'POST') {
      const { role, playerName } = req.body;
      
      if (!role || !playerName) {
        context.res = {
          status: 400,
          body: { error: 'Role and playerName required' }
        };
        return;
      }

      if (!data.roster[role]) {
        data.roster[role] = [];
      }
      
      data.roster[role].push(playerName);
      await writeData(data);
      
      context.res = {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true, roster: data.roster }
      };
      return;
    }

    // DELETE - Remove player from roster
    if (req.method === 'DELETE') {
      const { role, playerName } = req.body;
      
      if (!role || !playerName) {
        context.res = {
          status: 400,
          body: { error: 'Role and playerName required' }
        };
        return;
      }

      if (data.roster[role]) {
        data.roster[role] = data.roster[role].filter(p => p !== playerName);
      }
      
      await writeData(data);
      
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true, roster: data.roster }
      };
      return;
    }

    context.res = {
      status: 400,
      body: { error: 'Invalid request' }
    };

  } catch (error) {
    context.log.error('Roster error:', error);
    context.res = {
      status: 500,
      body: { error: 'Server error' }
    };
  }
};
