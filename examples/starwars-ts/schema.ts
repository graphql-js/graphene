import {
  ObjectType,
  InterfaceType,
  Schema,
  Field,
  ID,
  description,
  EnumType,
  NonNull
} from '../../src';
import { getHero, getFriends, getHuman, getDroid } from './data';

@EnumType()
@description('The description')
export class Episode {
  @description('Released in 1977.') static NEWHOPE = 4;
  @description('Released in 1980.') static EMPIRE = 5;
  @description('Released in 1983.') static JEDI = 6;
}

@InterfaceType({
  resolveType: (root: Character) => {
    return getHuman(root.id) ? Human : Droid;
  }
})
@description('A character in the Star Wars Trilogy')
export class Character {
  @Field(NonNull(ID))
  @description('The id of the character.')
  public id: string;

  @Field(String)
  @description('The name of the character.')
  public name: string;

  @Field([Character])
  @description(
    'The friends of the character, or an empty list if they have none.'
  )
  friends?(): Character[] {
    return getFriends(this);
  }

  @Field([Episode])
  @description('Which movies they appear in.')
  public appearsIn: number[];

  public friendIds: string[];
}

@ObjectType({
  interfaces: [Character]
})
@description('A humanoid creature in the Star Wars universe.')
export class Human implements Character {
  @Field(String)
  @description('The home planet of the human, or null if unknown..')
  public homePlanet?: string;

  id: string;
  name: string;
  friends?: () => Character[];
  friendIds: string[];
  appearsIn: number[];
}

@ObjectType({
  interfaces: [Character]
})
@description('A mechanical creature in the Star Wars universe.')
export class Droid implements Character {
  @Field(String)
  @description('The primary function of the droid, or null if unknown..')
  public primaryFunction: string;

  id: string;
  name: string;
  friends?: () => Character[];
  friendIds: string[];
  appearsIn: number[];
}

@ObjectType()
class Query {
  @Field(Character, { args: { episode: Episode } })
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

export default schema;
