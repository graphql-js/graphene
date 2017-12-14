import {
  ObjectType,
  Schema,
  Field,
  field,
  argument,
  String
} from './graphene2';

@object({
  description: 'The description',
  typeName: 'typename'
})
class User {
  @field() firstName: string;

  @field() lastName: string;

  @field()
  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

@object()
class Query {
  @field()
  getUser(@argument() name: string): User {
    return {
      firstName: 'Syrus',
      lastName: 'Akbary'
    };
  }
}

const schema = new Schema({
  query: Query
});

// class SequelizeObjectType extends ObjectType {
//     static model = Model;
// }
