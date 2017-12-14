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
  resolveType: (root: Character) => {
    return getHuman(root.id) ? Human : Droid;
  },
  description: 'A character in the Star Wars Trilogy'
})
export class Character {
  @Field(ID, 'The id of the character.')
  public id: string;

  @Field(String, 'The name of the character.')
  public name: string;

  @Field(
    [Character],
    'The friends of the character, or an empty list if they have none.'
  )
  friends?(): Character[] {
    return getFriends(this);
  }

  // @Field([Episode], { description: 'Which movies they appear in.' })
  public appearsIn: number[];

  public friendIds: string[];
}

@ObjectType({
  interfaces: [Character]
})
export class Human implements Character {
  @Field(String, 'The home planet of the human, or null if unknown..')
  public homePlanet?: string;

  id: string;
  name: string;
  friends?: () => Character[];
  friendIds: string[];
  appearsIn: number[];
}

@ObjectType({
  interfaces: [Character],
  description: 'A mechanical creature in the Star Wars universe.'
})
export class Droid implements Character {
  @Field(String, 'The primary function of the droid, or null if unknown..')
  public primaryFunction: string;

  id: string;
  name: string;
  friends?: () => Character[];
  friendIds: string[];
  appearsIn: number[];
}

@ObjectType()
class Query {
  @Field(Character, { episode: Number })
  hero(args: { episode: number }): Character {
    return getHero(args.episode);
  }

  @Field(Human, { id: String })
  human(args: { id: string }): Human {
    return getHuman(args.id);
  }

  @Field(Droid, { id: String })
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
