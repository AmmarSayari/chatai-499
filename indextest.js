const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Server is working fine.');
});

app.post('/', (req, res) => {
  res.send('Server is working fine.');
});

app.listen(port, () => {
  console.log('Server is running on port', port);
});
