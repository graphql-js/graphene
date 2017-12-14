import {
  ObjectType,
  Schema,
  Field,
  Interface,
  String,
  ID,
  List,
  Enum
} from "../../src/types_old";
import { getHero, getFriends, getHuman, getDroid } from "./data";

export class Episode extends Enum {
  static description = "The description";
  static values = {
    NEWHOPE: {
      value: 4,
      description: "Released in 1977."
    },
    EMPIRE: {
      value: 5,
      description: "Released in 1980."
    },
    JEDI: {
      value: 6,
      description: "Released in 1983."
    }
  };
}

class Character extends Interface {
  static description = "A character in the Star Wars Trilogy";
  static fields = {
    id: new ID({ required: true, description: "The id of the character." }),
    name: new String({ description: "The name of the character." }),
    friends: new List(Character, {
      description: "The friends of the character, or an empty list if they have none."
    }),
    appearsIn: new Episode({ description: "Which movies they appear in." })
  };
  static resolveType = (root: TCharacter) => {
    return getHuman(root.id) ? Human: Droid;
  };
  friends(root: TCharacter): TCharacter[] {
    return getFriends(root);
  }
}


type TCharacter = Human | Droid;

export class Human extends ObjectType {
  static description = "A humanoid creature in the Star Wars universe.";
  static interfaces = [Character];
  static fields = {
    homePlanet: new String({
      description: "The home planet of the human, or null if unknown.."
    })
  };

  id: string;
  name: string;
  friendIds: string[];
  appearsIn: number[];
  homePlanet?: string;
}

export class Droid extends ObjectType {
  static description = "A mechanical creature in the Star Wars universe.";
  static interfaces = [Character];
  static fields = {
    primaryFunction: new String({
      description: "The primary function of the droid, or null if unknown."
    })
  };

  id: string;
  name: string;
  friendIds: string[];
  appearsIn: number[];
  primaryFunction?: string;
}

class Query extends ObjectType {
  static fields = {
    hero: new Field(Character, { args: { episode: new Episode() } }),
    human: new Field(Human, { args: { id: new ID() } }),
    droid: new Field(Droid, { args: { id: new ID() } })
  };

  hero(root: any, args: { episode: any }): TCharacter {
    return getHero(args.episode);
  }
  human(root: any, args: { id: string }): Human {
    return getHuman(args.id);
  }
  droid(root: any, args: { id: string }): Droid {
    return getDroid(args.id);
  }
}

const schema = new Schema({
  query: Query
});

export default schema;
