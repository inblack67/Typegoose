import 'reflect-metadata';
import express, { Response, Request } from 'express';
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import http from 'http';
import 'dotenv-safe/config';
import 'colors';
import { isProd } from './utils/constants';
import { getSchema } from './utils/schema';
import { MyContext } from './utils/types';
import { connectDB } from './utils/connectDB';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';

const main = async () =>
{
    await connectDB();

    const MongoStore = connectMongo( session );

    const app = express();

    app.get( '/', ( _: Request, res: Response ) =>
    {
        res.send( 'API up and runnin' );
    } );

    app.use( session( {
        store: new MongoStore( { mongooseConnection: mongoose.connection } ),
        name: 'quid',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: isProd(),
            maxAge: 1000 * 60 * 60
        }
    } ) );

    const apolloServer = new ApolloServer( {
        schema: await getSchema(),
        context: ( req: Request, res: Response ): MyContext => ( { req, res, session: req?.session } ),
        playground: {
            settings: {
                "request.credentials": "include"
            }
        }
    } );


    apolloServer.applyMiddleware( { app } );

    const ws = http.createServer( app );
    apolloServer.installSubscriptionHandlers( ws );

    const PORT = process.env.PORT || 5000;

    ws.listen( PORT, async () =>
    {
        console.log( `Server started on port ${ PORT }`.green.bold );
    } );
};

main().catch( err => console.error( err ) );