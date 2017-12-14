import { Field } from './field';
import { ObjectType, ResolverFunction, GrapheneObjectType } from './objecttype';
import { UnMountedArgumentMap } from './argument';
import { getGraphQLType } from './base';

export class Mutation extends ObjectType {
  static mutationName: string;
  static args: UnMountedArgumentMap;
  static outputType: any;
  static constructType(): GrapheneObjectType {
    if (this.outputType) {
      return <GrapheneObjectType>getGraphQLType(this.outputType);
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
    return new Field(this.outputType || this, {
      args: this.args,
      resolver: this.mutate
    });
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
