import { GraphQLInputType, GraphQLArgumentConfig } from 'graphql';
import { MountableArgument, isMountableArgument } from './mountable';
import { NonNull } from './structures';
import { getGraphQLType } from './base';

export type ArgumentOptions = {
  required?: boolean;
  description?: string;
  defaultValue?: any;
};

export class Argument {
  type: any;
  options: ArgumentOptions;
  get gql(): GraphQLArgumentConfig {
    return {
      type: <GraphQLInputType>getGraphQLType(this.type),
      description: this.options.description,
      defaultValue: this.options.defaultValue
    };
  }
  constructor(type: any, options: ArgumentOptions = {}) {
    if (options.required) {
      type = new NonNull(type);
    }
    this.type = type;
    this.options = options;
  }
}

export type UnMountedArgumentMap = {
  [key: string]: Argument | MountableArgument;
};

export type MountedArgumentMap = {
  [key: string]: Argument;
};

export const mountArguments = (
  args: UnMountedArgumentMap
): MountedArgumentMap => {
  var mountedArguments: MountedArgumentMap = {};
  for (let argName in args) {
    let arg = args[argName];
    if (isMountableArgument(arg)) {
      mountedArguments[argName] = arg.toArgument();
    } else if (arg instanceof Argument) {
      mountedArguments[argName] = arg;
    } else {
      throw new Error(`Received incompatible argument: ${argName} ${arg}.`);
    }
  }
  return mountedArguments;
};

export const constructArgs = (args: MountedArgumentMap) => {
  var gqlArgs: {
    [key: string]: GraphQLArgumentConfig;
  } = {};
  for (let argName in args) {
    gqlArgs[argName] = args[argName].gql;
  }
  return gqlArgs;
};
