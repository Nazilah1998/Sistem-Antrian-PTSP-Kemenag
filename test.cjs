const axios = require('axios');
const jwt = require('jsonwebtoken');

async function test() {
  const token = jwt.sign({ id: 1, username: 'admin', role: 'ADMIN' }, 'fallback_secret_key_change_in_production');
  try {
    const res = await axios.post('http://127.0.0.1:3000/api/queue/adjust', {
      categoryId: 1,
      action: 'INCREMENT',
      counter: '01'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.log("Error:", err.response ? err.response.data : err.message);
  }
}
test();
