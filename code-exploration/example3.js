import { ObjectType, Schema, String } from "graphene";

class User extends ObjectType {
  static fields = {
      getUser: new User({id: new String()})
  }
  
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
