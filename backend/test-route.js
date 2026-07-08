const express = require('express');
const app = express();

app.get(/.*/, (req, res) => {
  res.send('ok');
});

console.log('App started successfully');
