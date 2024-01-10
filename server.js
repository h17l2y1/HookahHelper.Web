const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist/hookah-helper-ui'));
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/dist/hookah-helper-ui/index.html');
});

app.listen(process.env.PORT || 8080);
