import {
  ObjectType,
  InterfaceType,
  Schema,
  Field,
  // Interface,
  // String,
  ID
  // EnumType,
  // EnumValue
  // List,
  // Enum
} from '../../src/types';
import { getHero, getFriends, getHuman, getDroid } from './data';

@InterfaceType({
  description: 'A character in the Star Wars Trilogy',
  resolveType: (root: Character) => {
    return getHuman(root.id) ? Human : Droid;
  }
})
export class Character {
  @Field(ID, { description: 'The id of the character.' })
  public id: string;

  @Field(String, { description: 'The name of the character.' })
  public name: string;

  @Field([Character], {
    description:
      'The friends of the character, or an empty list if they have none.'
  })
  friends?(): Character[] {
    return getFriends(this);
  }

  // @Field([Episode], { description: 'Which movies they appear in.' })
  public appearsIn: number[];

  public friendIds: string[];
}

@ObjectType({
  description: 'A humanoid creature in the Star Wars universe.',
  interfaces: [Character]
})
export class Human implements Character {
  @Field(String, {
    description: 'The home planet of the human, or null if unknown..'
  })
  public homePlanet?: string;

  id: string;
  name: string;
  friends?: () => Character[];
  friendIds: string[];
  appearsIn: number[];
}

@ObjectType({
  description: 'A mechanical creature in the Star Wars universe.',
  interfaces: [Character]
})
export class Droid implements Character {
  @Field(String, {
    description: 'The primary function of the droid, or null if unknown..',
    deprecationReason: 'a'
  })
  public primaryFunction: string;

  id: string;
  name: string;
  friends?: () => Character[];
  friendIds: string[];
  appearsIn: number[];
}

@ObjectType()
class Query {
  @Field(Character, { args: { episode: Number } })
  hero(args: { episode: number }): Character {
    return getHero(args.episode);
  }

  @Field(Human, { args: { id: String } })
  human(args: { id: string }): Human {
    return getHuman(args.id);
  }

  @Field(Droid, { args: { id: String } })
  droid(args: { id: string }): Droid {
    return getDroid(args.id);
  }
}

const schema = new Schema({
  query: Query
});

console.log(schema.toString());
schema
  .execute(
    `{ hero {
  id
}
}`
  )
  .then(resp => console.log(resp));

export default schema;

// enum EpisodeValues {
//   NEWHOPE = 4,
//   EMPIRE = 5,
//   JEDI = 6
// }

type EnumOptions<T> = {
  name: string;
  values: {
    [key: string]: T;
  };
};
class Enum<T = any> {
  constructor(opts: EnumOptions<T>) {
    console.log(opts);
  }
  [key: string]: T;
}

// if (MyEnum.EMPIRE === 2) {
//   console.log("asdfsadf");
// }

// var myEnum = {
//   name: 'MyEnum',
//   values: {
//     NEW_HOPE: 1
//   }
// }
// @EnumType({
//   description: 'The description'
// })
// export class Episode {
//   @EnumValue({
//     description: 'Released in 1977.'
//   })
//   static NEWHOPE = 4;

//   @EnumValue({
//     description: 'Released in 1980.'
//   })
//   static EMPIRE = 5;

//   @EnumValue({
//     description: 'Released in 1983.'
//   })
//   static JEDI = 6;
// }

// type EnumOptions<T> = {
//   name: string;
//   values: {
//     [key: string]: T;
//   };
// };
// class Enum<T = any> {
//   constructor(opts: EnumOptions<T>) {
//     console.log(opts);
//   }
//   [key: string]: T;
// }
// var Episode = new Enum<number>({
//   name: 'Episode',
//   values: {
//     NEWHOPE: 4
//   }
// });
// console.log(Episode);

// const nameAndAgeOnly = pick(Episode, 'NEWHOPE'); // { name: string, age: number }

// console.log(nameAndAgeOnly);
// Episode.prototype
// type t<T extends { prototyp?: any }> = T["prototype"];
// type ValuesEnum = keyof (t<Episode>);
// var x: ValuesEnum = 3;
// console.log(x);
// type EV = Values<Episode>;

// var r: K1 = 1;
// console.log(r);
// var x: [keyof Episode] = 3;

var Episode = new Enum<4>({
  name: 'Episode',
  values: {
    NEW_HOPE: 4
  }
});
console.log(Episode.NEWHOPE);
