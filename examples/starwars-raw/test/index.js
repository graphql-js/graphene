import { graphql, printSchema } from 'graphql';
import schema, { Episode } from '../schema';

describe('Interface', () => {
  test(`create Interface`, () => {
    expect(printSchema(schema)).toMatchSnapshot();
  });
  test('try query', async () => {
    var result = await graphql(
      schema,
      `
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
      `
    );
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
});
