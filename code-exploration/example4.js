import { ObjectType, Schema, Field } from "graphene";

class User extends ObjectType {
  @Field
  a: str
}

class Query extends ObjectType {
  static getUser = new User({id: new String()});

  getUser({id}) {
    return {
      name: "Syrus"
    };
  }
}

const schema = new Schema({
  query: Query,
});
