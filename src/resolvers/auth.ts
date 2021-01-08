import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserEntity, UserModel } from "../entities/user";
import { MyContext } from "../utils/types";

@Resolver()
export class AuthResolver
{
    @Query( () => UserEntity )
    async getMe (
        @Ctx()
        { session }: MyContext
    )
    {
        if ( !session?.user )
        {
            throw new Error( 'Not Auth' );
        }
        const user = await UserModel.findById( session.user );
        return user;
    }

    @Query( () => [ UserEntity ] )
    async getUsers ()
    {
        const users = await UserModel.find();
        return users;
    }

    @Mutation( () => UserEntity )
    async register (
        @Ctx()
        { session }: MyContext,
        @Arg( 'name' )
        name: string,
    )
    {
        if ( session?.user )
        {
            throw new Error( 'Not Auth' );
        }
        const newUser = await UserModel.create( { name } as UserEntity );

        session.user = newUser._id;

        return newUser;
    }

    @Mutation( () => UserEntity )
    async login (
        @Ctx()
        { session }: MyContext,
        @Arg( 'name' )
        name: string,
    )
    {
        if ( session?.user )
        {
            throw new Error( 'Not Auth' );
        }
        const user = await UserModel.findOne( { name } as UserEntity );

        if ( !user )
        {
            throw new Error( 'Invalid Cred' );
        }

        return user;
    }

    @Mutation( () => Boolean )
    async logout (
        @Ctx()
        { session }: MyContext,
    )
    {
        if ( !session?.user )
        {
            throw new Error( 'Not Auth' );
        }

        session.destroy( err =>
        {
            console.log( `Session Destruction Error = `.red.bold );
            console.error( err );
        } );

        return true;
    }
}
