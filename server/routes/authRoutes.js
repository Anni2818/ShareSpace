const express = require('express');
const router = express.Router(); // ✅ Correct Express router

router.post('/register', (req, res) => {
  res.send('Register route working');
});

module.exports = router;
