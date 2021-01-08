import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class UserEntity
{
    @Field()
    @prop( { unique: true, required: true } )
    public name: string;
}

export const UserModel = getModelForClass( UserEntity );