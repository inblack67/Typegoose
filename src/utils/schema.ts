import { buildSchema } from 'type-graphql';
import { HelloResolver } from '../resolvers/hello';
import { AuthResolver } from '../resolvers/auth';

export const getSchema = async () =>
{
    const schema = await buildSchema( {
        resolvers: [ HelloResolver, AuthResolver ],
        validate: false,
    } );

    return schema;
};

