
import { ObjectType, Schema, Field, field, argument, String, ID } from "./graphene2";

class Episode {
    static description = "The description"
    static values = {
        NEW_HERO: new EnumValue({value: 3, description:"New hero movie"})
    }
}

class Character {
    static description = "A character in the Star Wars Trilogy";

    @field(String, {description: "The id of the character."})
    id: string;

    @field(String, {description: "The name of the character."})
    name: string;

    @field(Character, {description: "The friends of the character, or an empty list if they have none."})
    friends: Character[];

    @field(Episode, {description: "Which movies they appear in."})
    appearsIn: Episode[];
}

class Human {
    static description = "A humanoid creature in the Star Wars universe.";
    static interfaces = [Character];

    @field(String, {description:"The home planet of the human, or null if unknown.."})
    homePlanet
}

class Droid {
    static description = "A mechanical creature in the Star Wars universe.";
    static interfaces = [Character];

    @field(String, {description:"The primary function of the droid."})
    primaryFunction
}

class Query extends ObjectType {
    @field(Character, {episode: new Episode()})
    hero({episode: number}): Character {
        return {
            id: "1",
            appearsIn: [],
            friends: [],
            name: "as",
        };
    }

    @field(Droid, {id: new ID()})
    human({id: string}): Character & Human {
        return {
            id: "1",
            appearsIn: [],
            friends: [],
            name: "as",
            homePlanet: "earth",
        };
    }

    @field(Droid, {id: new ID()})
    droid({id: string}): Character & Droid {
        return {
            id: "1",
            appearsIn: [],
            friends: [],
            name: "as",
            primaryFunction: "kill",
        };
    }
}

const schema = new Schema({
  query: Query,
});

// class SequelizeObjectType extends ObjectType {
//     static model = Model;
// }
