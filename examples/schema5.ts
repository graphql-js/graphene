import { ObjectType, InterfaceType, Field, Schema } from '../src/types';

@InterfaceType({})
class BasePerson {
  @Field(String) public id: string;
}

@ObjectType({
  interfaces: [BasePerson]
})
class Person {
  @Field(String) public id: string;

  @Field(String) public name: string;

  @Field(String) public lastName: string;

  @Field(String)
  public fullName(): string {
    return `${this.name} ${this.lastName}`;
  }

  private bestFriendId?: string;

  @Field(Person)
  public bestFriend(): Person | void {
    if (this.bestFriendId) {
      return persons[this.bestFriendId];
    }
  }

  @Field([Person])
  public allFriends: Person[];

  constructor(
    id: string,
    name: string,
    lastName: string,
    bestFriendId?: string
  ) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.bestFriendId = bestFriendId;
  }
}

var persons: {
  [key: string]: Person;
} = {
  '1': new Person('1', 'Peter', 'Griffin', '2'),
  '2': new Person('2', 'Lisa', 'Simpson', '1')
};

@ObjectType()
class Query {
  @Field(Person, { args: { id: String } })
  public getPerson(args: { id: string }): Person {
    return persons[args.id];
  }
}

// @InterfaceType()
// class MyIf {
//   @Field(String) public x: string;
// }

// var Search = UnionType({
//   name: 'Search',
//   types: [Person, Query]
// });

// @EnumType()
// class RGB {
//   @EnumValue() RED = 0;
//   @EnumValue() GREEN = 1;
//   @EnumValue() BLUE = 2;
// }
// // class Search {
// //   @PossibleType(Query)
// //   @PossibleType(Person)
// // }

// class R implements MyIf {
//   x: string;
// }
// console.log(new R());
// var MyUnion = UnionType('MyUnion', [Query, Person])

// // console.log(Reflect.getMetadata(GRAPHENE_FIELDS, Person));
// var personType = Reflect.getMetadata(GRAPHENE_TYPE_METADATA_KEY, Person);
// var queryType = Reflect.getMetadata(GRAPHENE_TYPE_METADATA_KEY, Query);
// console.log(personType, personType.getFields());
// console.log(queryType, queryType.getFields());
// var p = new Person('2', 'remo', 'Jansen');
// p.name = 'Remo';
// // var n = p.name;

var schema = new Schema({
  query: Query
});

console.log(schema.toString());
schema
  .execute(
    `{ getPerson(id: "1") {
  id
  fullName
  bestFriend {
    id
    name
  }
}
}`
  )
  .then(resp => console.log(resp.data));
export default schema;
