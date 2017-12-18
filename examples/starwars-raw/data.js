const luke = {
  id: '1000',
  name: 'Luke Skywalker',
  friendIds: ['1002', '1003', '2000', '2001'],
  appearsIn: [4, 5, 6],
  homePlanet: 'Tatooine'
};

const vader = {
  id: '1001',
  name: 'Darth Vader',
  friendIds: ['1004'],
  appearsIn: [4, 5, 6],
  homePlanet: 'Tatooine'
};

const han = {
  id: '1002',
  name: 'Han Solo',
  friendIds: ['1000', '1003', '2001'],
  appearsIn: [4, 5, 6]
};

const leia = {
  id: '1003',
  name: 'Leia Organa',
  friendIds: ['1000', '1002', '2000', '2001'],
  appearsIn: [4, 5, 6],
  homePlanet: 'Alderaan'
};

const tarkin = {
  id: '1004',
  name: 'Wilhuff Tarkin',
  friendIds: ['1001'],
  appearsIn: [4]
};

const humanData = {
  1000: luke,
  1001: vader,
  1002: han,
  1003: leia,
  1004: tarkin
};

const threepio = {
  id: '2000',
  name: 'C-3PO',
  friendIds: ['1000', '1002', '1003', '2001'],
  appearsIn: [4, 5, 6],
  primaryFunction: 'Protocol'
};

const artoo = {
  id: '2001',
  name: 'R2-D2',
  friendIds: ['1000', '1002', '1003'],
  appearsIn: [4, 5, 6],
  primaryFunction: 'Astromech'
};

const droidData = {
  2000: threepio,
  2001: artoo
};

/**
 * Helper function to get a character by ID.
 */
function getCharacter(id) {
  // Returning a promise just to illustrate GraphQL.js's support.
  return Promise.resolve(humanData[id] || droidData[id]);
}

/**
 * Allows us to query for a character's friendIds.
 */
export function getFriends(character) {
  return character.friendIds.map(id => getCharacter(id));
}

/**
 * Allows us to fetch the undisputed hero of the Star Wars trilogy, R2-D2.
 */
export function getHero(episode) {
  if (episode === 5) {
    // Luke is the hero of Episode V.
    return luke;
  }
  // Artoo is the hero otherwise.
  return artoo;
}

/**
 * Allows us to query for the human with the given id.
 */
export function getHuman(id) {
  return humanData[id];
}

/**
 * Allows us to query for the droid with the given id.
 */
export function getDroid(id) {
  return droidData[id];
}
