/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

class BaseClass {}

const BaseClassProperties = Object.getOwnPropertyNames(BaseClass);

// We remove the properties automatically included in the BaseClass
// Such as .length, .name and .prototype
export const getStaticProperties = (_class: Object) => {
  return Object.getOwnPropertyNames(_class).filter(
    name => BaseClassProperties.indexOf(name) === -1
  );
};
