import { GraphQLList, GraphQLNonNull } from "graphql";
import { GraphQLClassType, getGraphQLType } from "./base";
import { MountableField, MountableArgument, Mountable } from "./mountable";
import { Field } from "./field";
import { Argument } from "./argument";


export class List extends Mountable implements MountableField, MountableArgument {
    ofType: GraphQLClassType;
    constructor(ofType: GraphQLClassType, ...args: any[]) {
        super(...args);
        this.ofType = ofType;
    }
    get gql() {
        if (this.args.length) {
            throw new Error(`The List arguments: ${this.args} will be dismissed.`);
        }
        return new GraphQLList(getGraphQLType(this.ofType));
    }
    toField():Field {
        return new Field(new List(this.ofType), ...this.args);
    }
    toArgument():Argument {
        return new Argument(new List(this.ofType), ...this.args);
    }
}

export class NonNull extends Mountable implements MountableField, MountableArgument {
    ofType: GraphQLClassType;
    constructor(ofType: GraphQLClassType, ...args: any[]) {
        super(...args);
        this.ofType = ofType;
    }
    get gql() {
        if (this.args.length) {
            throw new Error(
                `The NonNull arguments: ${this.args} will be dismissed.`+
                `You will need to mount as a Field with using INSTANCE.toField()`
            );
        }
        return new GraphQLNonNull(getGraphQLType(this.ofType));
    }
    toField():Field {
        return new Field(new NonNull(this.ofType), ...this.args);
    }
    toArgument(): Argument {
        return new Argument(new NonNull(this.ofType), ...this.args);
    }
}