const express = require('express');
const persistence = require("./persistence")
const linkPreview = require('./linkPreview')

const port = 3000;

// So that CTRL +  C ends normally, not with error
process.on('SIGINT', () => {
  process.exit();
});

const persistenceStorage = new persistence.Storage("db/cards");
const persistenceTestStorage = new persistence.Storage("db/test");

(async function () {

  await persistenceStorage.init();
  await persistenceTestStorage.init()

  const app = express();
  app.use(express.json())
  app.use(express.static("static"))
  app.use(express.static("dist/client"))

  // Home Page: redirect to cards.html
  app.get('/', (req, res) => { res.redirect(301, "cards.html"); });

  // Link Preview
  app.post('/linkPreview', standardAsyncHandler(linkPreview.getLinkPreview));

  // Persistence
  app.post('/rpc/persistence/*', standardAsyncHandler(dispatchPersistence));
  app.post('/db/writeKeyValue', standardAsyncHandler(persistence.handleWrite));
  app.post('/db/readKey', standardAsyncHandler(persistence.handleRead));

  // Start listening
  app.listen(port, () => console.log(`server is listening on ${port}`));

})();

//
// Helpers
//

function standardAsyncHandler(handlerFunction) {
  return async (req, res, next) => {
    try {
      const data = await handlerFunction(req, res);
      res.send(data);

    } catch (err) {
      return next(err)
    }
  }
}

async function dispatchPersistence(req) {
  const operation = getOperation("/rpc/persistence/", req.path)

  const { body } = req;
  if (!body)
    throw 'Request has no body: ' + req.path;

  const ps = req.body.test ? persistenceTestStorage : persistenceStorage;
  return ps.dispatch(operation, body)
}

function getOperation(prefix, path) {
  if (!path.startsWith(prefix))
    throw Error("Path does not start with '" + prefix + "', but is: " + path);
  return path.substring(prefix.length);
}

