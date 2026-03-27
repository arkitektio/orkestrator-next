
export type Identifier = string;
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = JSONValue[];

export type Object = {
  id: string;
  [key: string]: JSONValue;
};

