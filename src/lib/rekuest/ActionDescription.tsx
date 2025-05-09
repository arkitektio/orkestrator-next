import Handlebars from "handlebars";
import { useEffect, useState } from "react";

function replaceVariablesWithNames(implementation: string) {
  // This regular expression captures Handlebars expressions {{ variable }}
  let regex = /\{\{([^\{\}]+)\}\}/g;

  return implementation.replace(regex, function (match, variableName) {
    // Remove any whitespace and return the variable name
    return variableName.trim();
  });
}

function replaceUndefinedValuesWithKeyName(obj: any) {
  for (let key in obj) {
    if (obj[key] === undefined || obj[key] === null) {
      obj[key] = key;
    }
  }
  return obj;
}

export const ActionDescription = (props: {
  description: string;
  variables?: { [key: string]: any };
}) => {
  const [text, setText] = useState<string>(
    replaceVariablesWithNames(props.description),
  );

  useEffect(() => {
    if (props.variables) {
      const implementation = Handlebars.compile(props.description);
      const newText = implementation(
        replaceUndefinedValuesWithKeyName({ ...props.variables }),
      );
      setText(newText);
    } else {
      setText(replaceVariablesWithNames(props.description));
    }
  }, [props.description, props.variables]);

  return <>{text}</>;
};

export const useActionDescription = (props: {
  description: string;
  variables?: { [key: string]: any };
}) => {
  const [text, setText] = useState<string>(
    replaceVariablesWithNames(props.description),
  );

  useEffect(() => {
    if (props.variables) {
      const implementation = Handlebars.compile(props.description);
      const newText = implementation(
        replaceUndefinedValuesWithKeyName({ ...props.variables }),
      );
      setText(newText);
    } else {
      setText(replaceVariablesWithNames(props.description));
    }
  }, [props.description, props.variables]);

  return text;
};
