const { readData, writeData } = require('../shared/database');

module.exports = async function (context, req) {
  const id = context.bindingData.id;

  try {
    const data = await readData();

    // GET - List all schedule events
    if (req.method === 'GET') {
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data.schedule || []
      };
      return;
    }

    // POST - Create new event
    if (req.method === 'POST') {
      const event = {
        ...req.body,
        id: Date.now()
      };
      data.schedule.push(event);
      await writeData(data);
      
      context.res = {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: { success: true, event }
      };
      return;
    }

    // DELETE - Remove event by ID
    if (req.method === 'DELETE' && id) {
      data.schedule = data.schedule.filter(e => e.id !== parseInt(id));
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
    context.log.error('Schedule error:', error);
    context.res = {
      status: 500,
      body: { error: 'Server error' }
    };
  }
};
