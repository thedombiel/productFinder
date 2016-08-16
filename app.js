require('dotenv').load();
import Express from 'express';
import Logger from 'morgan';
import GraphHTTP from 'express-graphql';
import Schema from './app_server/schemas';

const APP_PORT = 3000;

const app = Express();

app.use(Logger('dev'));
app.use('/graphql', GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));


app.listen(APP_PORT, () => console.log(`App listening on port ${APP_PORT}`));
