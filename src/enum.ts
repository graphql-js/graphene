import { GraphQLEnumValueConfigMap, GraphQLEnumType } from "graphql";
import { Field } from "./field";
import { Argument } from "./argument";
import { MountableField, MountableArgument } from "./mountable";
import { GraphQLClassType } from "./base";


export class Enum extends GraphQLClassType implements MountableField, MountableArgument {
    args: any[];
    static _values: GraphQLEnumValueConfigMap;
    constructor(...args: any[]) {
        super();
        this.args = args;
    }
    static constructType() {
        return new GraphQLEnumType({
            name: this.typeName,
            description: this.description,
            values: this.values
        })
    }
    static set values(values: GraphQLEnumValueConfigMap) {
        this._values = values;
        // We set the keys in the class constructor as
        // a side-effect, so it's easy to access them.
        var this_: {[key: string]: any} = this;
        for (let valueName in values) {
            this_[valueName] = values[valueName].value;
        }
    }
    static get values() {
        return this._values;
    }
    toField() {
        return new Field(<typeof Enum>this.constructor, ...this.args);
    }
    toArgument() {
        return new Argument(<typeof Enum>this.constructor, ...this.args);
    }
}