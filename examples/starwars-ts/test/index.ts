import schema, { Episode } from '../schema4';

describe('Interface', () => {
  test(`create Interface`, () => {
    expect(schema.toString()).toMatchSnapshot();
  });
  test('try query', async () => {
    var result = await schema.execute(`
{
    hero {
        id
        name
        friends {
            id
            name
        }
    }
}
`);
    expect(result).toMatchObject({
      data: {
        hero: {
          friends: [
            { id: '1000', name: 'Luke Skywalker' },
            { id: '1002', name: 'Han Solo' },
            { id: '1003', name: 'Leia Organa' }
          ],
          id: '2001',
          name: 'R2-D2'
        }
      }
    });
  });
  test('Episode enum', () => {
    expect(Episode.NEWHOPE).toBe(4);
    expect(Episode.EMPIRE).toBe(5);
    expect(Episode.JEDI).toBe(6);
  });
});
