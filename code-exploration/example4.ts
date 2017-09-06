
import { ObjectType, Schema, Field } from "./graphene";

class User extends ObjectType {
    static fields = {
        firstName: new String(),
        lastName: new String(),
        fullName: new String()
    }

    firstName: string;
    lastName: string;

    fullName?({id: string}) {
        return `${this.firstName} ${this.lastName}`;
    }
}

class Query extends ObjectType {
  static fields = {
      getUser: new Field(User, {id: new String()})
  }

  getUser({id}): User {
    return {
      firstName: "Syrus",
      lastName: "Akbary"
    };
  }
}

const schema = new Schema({
  query: Query,
});

class SequelizeObjectType extends ObjectType {
    static model = Model;
}
