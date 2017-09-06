import { printType, GraphQLScalarType, GraphQLType } from "graphql";
import { List, NonNull } from "./structures";

export class GraphQLClassType {
  private static _gql: any;
  private static _typeName: string;
  static description: string;
  static get typeName(): string {
    return this._typeName || this.name;
  }
  static set typeName(value: string) {
    this._typeName = value;
  }
  static toString(): string {
    return printType(this.gql);
  }

  static get gql() {
    if (!this._gql) {
      this._gql = this.constructType();
    }
    return this._gql;
  }
  static constructType() {
    throw new Error("Any custom type must implement constructType.");
  }
}

export const getGraphQLType = (
  type: typeof GraphQLClassType | any
): GraphQLType => {
  if (
    type.prototype instanceof GraphQLClassType ||
    type instanceof List ||
    type instanceof NonNull
  ) {
    return type.gql;
  } else if (type instanceof GraphQLScalarType) {
    return type;
  }
  throw new Error(`Can't convert ${type} to a GraphQL type.`);
};
