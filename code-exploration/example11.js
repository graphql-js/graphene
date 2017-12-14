import { ObjectType, Schema, String } from 'graphene';

class User extends ObjectType {
  name = new String();
}

class Query extends ObjectType {
  getUser = new User({ id: new String() });

  getUserResolver({ id }) {
    return {
      name: 'Syrus'
    };
  }
}

const schema = new Schema({
  query: Query
});
