import { GraphQLFieldConfig, GraphQLOutputType } from 'graphql';
import { MountableField, isMountableField } from './mountable';
import { getGraphQLType } from './base';
import { NonNull } from './structures';
import {
  MountedArgumentMap,
  UnMountedArgumentMap,
  mountArguments
} from './argument';
import { ResolverFunction } from './objecttype';

type FieldOptions<T> = {
  required?: boolean | MountableField;
  description?: string;
  deprecationReason?: string;
  resolver?: ResolverFunction<T>;
  args?: UnMountedArgumentMap;
};

export class Field<T = any> {
  type: any;
  options: FieldOptions<T>;
  args: MountedArgumentMap;
  get gql(): GraphQLFieldConfig<any, any> {
    return {
      type: <GraphQLOutputType>getGraphQLType(this.type),
      description: this.options.description,
      deprecationReason: this.options.deprecationReason
    };
  }
  constructor(type: any, options: FieldOptions<T> = {}) {
    if (options.required) {
      type = new NonNull(type);
    }
    this.type = type;
    this.options = options;
    this.args = mountArguments(this.options.args || {});
  }
  getResolver(parentResolver: ResolverFunction<T>) {
    return this.options.resolver || parentResolver;
  }
}

export type UnmountedFieldMap = {
  [key: string]: Field | MountableField;
};

export type MountedFieldMap = {
  [key: string]: Field;
};

export const mountFields = (fields: UnmountedFieldMap): MountedFieldMap => {
  var mountedFields: MountedFieldMap = {};
  for (let fieldName in fields) {
    let field = fields[fieldName];
    if (isMountableField(field)) {
      mountedFields[fieldName] = field.toField();
    } else if (field instanceof Field) {
      mountedFields[fieldName] = field;
    } else {
      throw new Error(`Received incompatible field: ${fieldName} ${field}.`);
    }
  }
  return mountedFields;
};
