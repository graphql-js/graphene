
import { ObjectType, Schema, Field, field, argument, String, ID } from "./graphene2";

// class Episode {
//     static description = "The description"
//     static values = {
//         NEW_HOPE: new EnumValue({value: 4, })
//     }
// }

class Character {
    static description = "A character in the Star Wars Trilogy";
    static fields = {
        id: new ID({required:true, description: "The id of the character."}),
        name: new String({description: "The name of the character."}),
        friends: new Field(Character, {description: "The friends of the character, or an empty list if they have none."}),
        // appearsIn: new Field(Episode, {description: "Which movies they appear in."})
    }

    id: string;
    name: string;
    friendIds: string[];
    appearsIn: number[];
}

class Human {
    static description = "A humanoid creature in the Star Wars universe.";
    static interfaces = [Character];
    static fields = {
        ...Character.fields,
        homePlanet: new String({description:"The home planet of the human, or null if unknown.."})
    }

    homePlanet: string;
}

class Droid {
    static description = "A mechanical creature in the Star Wars universe.";
    static interfaces = [Character];
    static fields = {
        ...Character.fields,
        primaryFunction: new String({description:"The primary function of the droid, or null if unknown.."})
    }

    primaryFunction: string;
}

class Query extends ObjectType {
    static fields = {
        // hero: new Field(Character, {episode: new Episode()}),
        human: new Field(Droid, {id: new ID()}),
        droid: new Field(Droid, {id: new ID()})
    }

    // hero({episode: number}): Character & (Human | Droid) {
    //     return {
    //         id: "1",
    //         appearsIn: [],
    //         friendIds: [],
    //         name: "as",
    //         homePlanet: "a",
    //     };
    // }


    human({id: string}): Character & Human {
        return {
            id: "1",
            appearsIn: [],
            friendIds: [],
            name: "as",
            homePlanet: "earth",
        };
    }

    droid({id: string}): Character & Droid {
        return {
            id: "1",
            appearsIn: [],
            friendIds: [],
            name: "as",
            primaryFunction: "kill",
        };
    }
}

const schema = new Schema({
  query: Query,
});

const Model =  new Object();
const getFieldsFromSequelizeModel = (model) => {
    return {}
}

class SequelizeObjectType extends ObjectType {
    static model = Model;
    static fields = {
        ...getFieldsFromSequelizeModel(Model)
    }
}
