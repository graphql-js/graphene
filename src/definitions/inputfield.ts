/**
 * Copyright (c) 2017-present, Graphene.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { isInputType } from "graphql";
import {
  UnmountedInputFieldMap,
  getInputFields,
  getGraphQLType,
  getDescription,
  getDeprecationReason
} from "./../reflection";

// The provided configuration type when creating an InputField.
export type InputFieldConfig = {
  defaultValue?: any;
  description?: string;
  deprecationReason?: string;
};

export const InputField = (type?: any, config: InputFieldConfig = {}) => (
  target: any,
  key: string
) => {
  const _class = target.constructor;
  let fields: UnmountedInputFieldMap = getInputFields(_class);
  if (key in fields) {
    throw new Error(`Field ${key} is already defined in ${_class}.`);
  }
  fields[key] = () => {
    const _type = getGraphQLType(type);
    if (!isInputType(_type)) {
      throw new Error("Type is not input");
    }
    const defaultValue: any = target[key];
    return {
      type: _type,
      description: config.description || getDescription(target, key),
      deprecationReason:
        config.deprecationReason || getDeprecationReason(target, key),
      defaultValue: config.defaultValue || defaultValue
    };
  };
};
