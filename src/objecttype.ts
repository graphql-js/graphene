import {
  GraphQLObjectType,
  defaultFieldResolver,
  GraphQLResolveInfo,
  GraphQLFieldConfig,
  GraphQLInterfaceType
} from "graphql";
import {
  UnmountedFieldMap,
  MountedFieldMap,
  mountFields
} from "./field";
import { Interface } from "./interface";
import { GraphQLClassType, getGraphQLType } from "./base";

type Input = { [key: string]: Input } | string | boolean | number | null;
type ResolverArguments = { [key: string]: Input };

export type ResolverFunction<T, R = any, A = ResolverArguments, C = any> = (
  root?: T,
  args?: A,
  context?: C,
  info?: GraphQLResolveInfo
) => R;

export class ObjectType extends GraphQLClassType {
  static gql: GraphQLObjectType;
  static _fields: UnmountedFieldMap;
  private static _interfaces: typeof Interface[];
  static set interfaces(value: typeof Interface[]) {
    this._interfaces = value;
  }
  static get interfaces(): typeof Interface[] {
    return this._interfaces || [];
  }
  static get fields() {
    var interfaceFields = {};
    for (let _interfaceIndex in this._interfaces) {
      let _interface: typeof Interface = this._interfaces[_interfaceIndex];
      interfaceFields = {
        ...interfaceFields,
        ..._interface.fields
      };
    }
    return {
      ...interfaceFields,
      ...this._fields
    };
  }

  static set fields(fields: UnmountedFieldMap) {
    this._fields = fields;
  }

  static get mountedFields(): MountedFieldMap {
    return mountFields(this.fields);
  }

  static constructType(): GraphQLObjectType {
    return new GraphQLObjectType({
      name: this.typeName,
      description: this.description,
      interfaces: this.interfaces.map(
        _interface => <GraphQLInterfaceType>getGraphQLType(_interface)
      ),
      fields: () => {
        var graphqlFields: {
          [key: string]: GraphQLFieldConfig<any, any>;
        } = {};
        for (let fieldName in this.mountedFields) {
          graphqlFields[fieldName] = {
              ...this.mountedFields[fieldName].gql,
              resolve: this.getResolver(fieldName),
          };
        }
        return graphqlFields;
      }
    });
  }

  static getResolver<T = any>(fieldName: string): ResolverFunction<T> {
    const field = this.mountedFields[fieldName];
    if (!field) {
      throw new Error(
        `Can't get the resolver of a a field that is not in the ObjectType. Received: ${fieldName}.`
      );
    }

    var parentResolver = <ResolverFunction<T>>this.resolvers[fieldName];
    if (!parentResolver) {
      for (let _interface of this._interfaces) {
        parentResolver = _interface.resolvers[fieldName];
        if (parentResolver) {
          break;
        }
      }
    }
    if (parentResolver) {
      return field.getResolver(parentResolver);
    }
    return field.getResolver(<ResolverFunction<T>>defaultFieldResolver);
  }

  static resolvers: {
    [key: string]: ResolverFunction<any>;
  } = {};
}
