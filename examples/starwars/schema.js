import {
  ObjectType,
  Schema,
  Field,
  Interface,
  String,
  ID,
  List,
  Enum
} from '../../src';
import { getHero, getFriends, getHuman, getDroid } from './data';

export class Episode extends Enum {
  static description = 'The description';
  static values = {
    NEWHOPE: {
      value: 4
    },
    EMPIRE: {
      value: 5
    },
    JEDI: {
      value: 6
    }
  };
}

class Character extends Interface {
  static description = 'A character in the Star Wars Trilogy';
  static fields = {
    id: new ID(),
    name: new String(),
    friends: new List(Character),
    appearsIn: new Episode()
  };
  static resolveType = root => {
    if (getHuman(root.id)) {
      return Human;
    }
    return Droid;
  };
  friends(root) {
    return getFriends(root);
  }
}

class Human extends ObjectType {
  static interfaces = [Character];
  static fields = {
    ...Character.fields,
    homePlanet: new String()
  };
}

class Droid extends ObjectType {
  static interfaces = [Character];
  static fields = {
    ...Character.fields,
    primaryFunction: new String()
  };
}

class Query extends ObjectType {
  static fields = {
    hero: new Field(Character, { args: { episode: new Episode() } }),
    human: new Field(Human, { args: { id: new ID() } }),
    droid: new Field(Droid, { args: { id: new ID() } })
  };

  hero(root, { episode }) {
    return getHero(episode);
  }
  human(root, { id }) {
    return getHuman(id);
  }
  droid(root, { id }) {
    return getDroid(id);
  }
}

const schema = new Schema({
  query: Query
});

export default schema;
