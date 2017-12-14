/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import { getFriends, getHero, getHuman, getDroid } from './starWarsData.js';

const episodeEnum = new GraphQLEnumType({
  name: 'Episode',
  description: 'One of the films in the Star Wars Trilogy',
  values: {
    NEWHOPE: {
      value: 4,
      description: 'Released in 1977.'
    },
    EMPIRE: {
      value: 5,
      description: 'Released in 1980.'
    },
    JEDI: {
      value: 6,
      description: 'Released in 1983.'
    }
  }
});

const characterInterface = new GraphQLInterfaceType({
  name: 'Character',
  description: 'A character in the Star Wars Trilogy',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the character.'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the character.'
    },
    friends: {
      type: new GraphQLList(characterInterface),
      description:
        'The friends of the character, or an empty list if they ' + 'have none.'
    },
    appearsIn: {
      type: new GraphQLList(episodeEnum),
      description: 'Which movies they appear in.'
    }
  }),
  resolveType: character => {
    return getHuman(character.id) ? humanType : droidType;
  }
});

const humanType = new GraphQLObjectType({
  name: 'Human',
  description: 'A humanoid creature in the Star Wars universe.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the human.'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the human.'
    },
    friends: {
      type: new GraphQLList(characterInterface),
      description:
        'The friends of the human, or an empty list if they ' + 'have none.',
      resolve: human => getFriends(human)
    },
    appearsIn: {
      type: new GraphQLList(episodeEnum),
      description: 'Which movies they appear in.'
    },
    homePlanet: {
      type: GraphQLString,
      description: 'The home planet of the human, or null if unknown.'
    }
  }),
  interfaces: [characterInterface]
});

const droidType = new GraphQLObjectType({
  name: 'Droid',
  description: 'A mechanical creature in the Star Wars universe.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the droid.'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the droid.'
    },
    friends: {
      type: new GraphQLList(characterInterface),
      description:
        'The friends of the droid, or an empty list if they ' + 'have none.',
      resolve: droid => getFriends(droid)
    },
    appearsIn: {
      type: new GraphQLList(episodeEnum),
      description: 'Which movies they appear in.'
    },
    primaryFunction: {
      type: GraphQLString,
      description: 'The primary function of the droid.'
    }
  }),
  interfaces: [characterInterface]
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hero: {
      type: characterInterface,
      args: {
        episode: {
          description:
            'If omitted, returns the hero of the whole saga. If ' +
            'provided, returns the hero of that particular episode.',
          type: episodeEnum
        }
      },
      resolve: (root, { episode }) => getHero(episode)
    },
    human: {
      type: humanType,
      args: {
        id: {
          description: 'id of the human',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, { id }) => getHuman(id)
    },
    droid: {
      type: droidType,
      args: {
        id: {
          description: 'id of the droid',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, { id }) => getDroid(id)
    }
  })
});

export const StarWarsSchema = new GraphQLSchema({
  query: queryType
});
