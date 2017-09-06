import { GraphQLScalarType, GraphQLString, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLFloat} from "graphql";
import { Field } from "./field";
import { Argument } from "./argument";
import { MountableField, MountableArgument } from "./mountable";
import { GraphQLClassType } from "./base";

export class Scalar extends GraphQLClassType implements MountableField, MountableArgument {
    args: any[];
    static gql: GraphQLScalarType;
    static serialize: (value: any) => any;
    static parseLiteral: (value: any) => any;
    static parseValue: (value: any) => any;
    static constructType() {
        return new GraphQLScalarType({
            name: this.typeName,
            description: this.description,
            serialize: this.serialize,
            parseLiteral: this.parseLiteral,
            parseValue: this.parseValue,
        })
    }
    constructor(...args: any[]) {
        super();
        this.args = args;
    }
    toField(): Field {
        var type = (<typeof Scalar>this.constructor).gql;
        return new Field(type, ...this.args);
    }
    toArgument(): Argument {
        var type = (<typeof Scalar>this.constructor).gql;
        return new Argument(type, ...this.args);
    }
}
export class String extends Scalar {
    static constructType() {
        return GraphQLString;
    }
}

exports.Str = String;

export class Boolean extends Scalar {
    static constructType() {
        return GraphQLBoolean;
    }
}

export class ID extends Scalar {
    static constructType() {
        return GraphQLID;
    }
}

export class Int extends Scalar {
    static constructType() {
        return GraphQLInt;
    }
}

export class Float extends Scalar {
    static constructType() {
        return GraphQLFloat;
    }
}
