
import { ObjectType, Schema, Field, field, argument, String } from "./graphene2";

const getClassFields = (t) => {
    return  {
        
    }
}


class User extends ObjectType {
    static description = "The description"
    static typeName = "The type name"
    static fields = {
        ...getClassFields(User),
    }

    @field(String)
    firstName: string;

    @field(String)
    lastName: string;

    @field(String)
    fullName?(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}

class Query extends ObjectType {
    @field(User, {id: new String()})
    getUser({id: string}): User {
        return {
            firstName: "Syrus",
            lastName: "Akbary"
        };
    }
}

const schema = new Schema({
  query: Query,
});

// class SequelizeObjectType extends ObjectType {
//     static model = Model;
// }
