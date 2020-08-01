const express = require('express');

const app = express();

app.get('/status', (req, res) => {
  res.status(200).send('OK').end();
});
app.use(express.static('dist'))

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
