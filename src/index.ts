import express, { Response, Request } from 'express';
import 'dotenv-safe/config';
import 'colors';

const app = express();

app.get( '/', ( _: Request, res: Response ) =>
{
    res.send( 'API up and runnin' );
} );

const PORT = +process.env.PORT! || 5000;
app.listen( PORT, () =>
{
    console.log( `Server started on port ${ PORT }`.green.bold );
} );