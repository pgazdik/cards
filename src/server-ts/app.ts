import express, { NextFunction, Request, Response } from 'express';

const port = 3000;

// So that CTRL +  C ends normally, not with error
process.on('SIGINT', () => {
  process.exit();
});


(async function () {


  const app = express();
  app.use(express.json())
  app.use(express.static("static"))
  app.use(express.static("dist/client"))

  // Home Page: redirect to cards.html
  app.get('/', (req, res) => { res.redirect(301, "cards.html"); });


  // Persistence
  app.post('/test', standardAsyncHandler(handleTest));

  // Start listening
  app.listen(port, () => console.log(`server is listening on ${port}`));

})();

//
// Helpers
//

async function handleTest(req: Request, res: Response): Promise<string> {
    return "RESPONSE FROM TypeScript"
}

function standardAsyncHandler(handlerFunction: (req: Request, res: Response) => Promise<unknown>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await handlerFunction(req, res);
      res.send(data);

    } catch (err) {
      return next(err)
    }
  }
}


