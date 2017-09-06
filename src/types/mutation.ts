import {
  GraphQLInterfaceType,
  GraphQLResolveInfo,
  GraphQLObjectType
} from 'graphql';
import { UnmountedFieldMap, Field } from './field';
import { ObjectType, ResolverFunction } from './objecttype';
import { UnMountedArgumentMap } from './argument';
import { GraphQLClassType, getGraphQLType } from './base';

export class Mutation extends ObjectType {
  static mutationName: string;
  static args: UnMountedArgumentMap;
  static _fields: UnmountedFieldMap | typeof GraphQLClassType;
  static constructType(): GraphQLObjectType {
    if (this.fields instanceof GraphQLClassType) {
      return <GraphQLObjectType>getGraphQLType(this.fields);
    }
    return ObjectType.constructType.call(this);
  }
  static mutate: ResolverFunction<any>;
  static toField() {
    if (!this.mutate) {
      throw new Error(
        `The mutation ${this.name} must define a mutate static method on it.`
      );
    }
    return new Field(this, { args: this.args, resolver: this.mutate });
  }
}

export const getMutationFields = (...mutations: typeof Mutation[]) => {
  var fields = {};
  for (let mutation of mutations) {
    fields = {
      ...fields,
      [mutation.mutationName]: mutation.toField()
    };
  }
  return fields;
};
