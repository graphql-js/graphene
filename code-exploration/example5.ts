
import { ObjectType, Schema, Field } from "./graphene";

class Query extends ObjectType {
    static fields = {
        hello: new String(),
    }

    hello() {
        return "Hello World!";
    }
}

const schema = new Schema({
  query: Query,
});
