
import { ObjectType, Schema, Field, String } from "./graphene";

class UserContainer {
    firstName: string;
    lastName: string;
}

class User extends ObjectType<UserContainer> {
    static fields = {
        firstName: new String(),
        lastName: new String(),
        fullName: new String(),
    }

    fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

class Query extends ObjectType<any> {
    static fields = {
        getUser: new Field(User, {id: new String()})
    }

    getUser({id}): UserContainer {
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
