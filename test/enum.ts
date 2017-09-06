import { GraphQLEnumType } from 'graphql';
import { Enum, Field, InputField, Argument } from '../src';

describe("Enum creation", () => {
  test(`create Enum`, () => {
    class MyEnum extends Enum {
    }
    expect(MyEnum.typeName).toBe("MyEnum");
    expect(MyEnum.description).toBe(undefined);
  })

  test(`create Enum custom settings`, () => {
    class MyEnum extends Enum {
      static typeName = "MyCustomEnum"
      static description = "MyCustomEnum Description";
    }
    expect(MyEnum.typeName).toBe("MyCustomEnum");
    expect(MyEnum.description).toBe("MyCustomEnum Description");
  })

  test(`create Enum with Values`, () => {
    class MyEnum extends Enum {
      static values = {
        VALUE1: {
          value: 1
        },
        VALUE2: {
          value: 2
        }
      }
    }
    expect(MyEnum.VALUE1).toBe(1);
    expect(MyEnum.VALUE2).toBe(2);
  })

  test(`create Enum graphql type`, () => {
    class MyEnum extends Enum {
      static description = "Desc";
      static values = {
        VALUE1: {
          description: "Value1 description",
          value: 1
        },
        VALUE2: {
          description: "Value2 description",
          deprecationReason: "Value2 is deprecated",
          value: 2
        }
      }
    }
    const gql = <GraphQLEnumType>MyEnum.gql;
    expect(gql).toBeInstanceOf(GraphQLEnumType);
    expect(gql.name).toBe("MyEnum");
    expect(gql.description).toBe("Desc");
    expect(gql.getValues()).toMatchObject([
      {
        "deprecationReason": undefined,
        "description": "Value1 description",
        "isDeprecated": false,
        "name": "VALUE1",
        "value": 1
      },
      {
        "deprecationReason": "Value2 is deprecated",
        "description": "Value2 description",
        "isDeprecated": true,
        "name": "VALUE2",
        "value": 2
      }
    ]);
  })

})

describe('Enum can be mounted', () => {
  class MyEnum extends Enum {
    static description = "Desc";
    static values = {
      VALUE1: {
        description: "Value1 description",
        value: 1
      },
      VALUE2: {
        description: "Value2 description",
        deprecationReason: "Value2 is deprecated",
        value: 2
      }
    }
  }

  test(`as a Field`, () => {
    let unmounted = new Enum({description: "MyEnum field"});
    let field = unmounted.toField();
    expect(field).toBeInstanceOf(Field);
    expect(field.type).toBe(Enum);
    expect(field.options).toMatchObject({description: "MyEnum field"});
  })

  test(`as a Argument`, () => {
    let unmounted = new Enum({description: "MyEnum argument"});
    let arg = unmounted.toArgument();
    expect(arg).toBeInstanceOf(Argument);
    expect(arg.type).toBe(Enum);
    expect(arg.options).toMatchObject({description: "MyEnum argument"});
  })

  test(`as a InputField`, () => {
    let unmounted = new Enum({description: "MyEnum input field"});
    let inputfield = unmounted.toInputField();
    expect(inputfield).toBeInstanceOf(InputField);
    expect(inputfield.type).toBe(Enum);
    expect(inputfield.options).toMatchObject({description: "MyEnum input field"});
  })
})
