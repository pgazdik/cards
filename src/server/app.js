var express = require('express');

var lp = require('link-preview-js')

const port = 3000;

const app = express();
app.use(express.json())
app.use(express.static("static"))
app.use(express.static("dist/client"))
app.use(express.static("node_modules/requirejs"))

app.get('/', (req, res) => {
  res.send('What are you doing here?');
});

app.post('/preview', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url)
      throw 'No url provided via body: ' + body;

    const data = await lp.getLinkPreview(url)
    res.send(data);

  } catch (err) {
    return next(err)
  }
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

// So that CTRL +  C ends normally, not with error
process.on('SIGINT', () => {
  process.exit();
});

