import { Editor, Monaco } from "@monaco-editor/react";
import OneDarkPro from "./theme.json";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { FieldProps } from "@/components/fields/types";

export const CypherField = ({
  name,
  validate,
  description,
  label,
}: FieldProps) => {
  const handleEditorDidMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("OneDarkPro", {
      ...OneDarkPro,
    });
  };

  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      rules={{ validate: validate }}
      render={({ field }) => (
        <>
          <FormItem className="flex flex-col dark:text-white">
            {label != undefined && <FormLabel>{label}</FormLabel>}

            <Editor
              options={{
                minimap: { enabled: false },
                lineNumbers: "off",
              }}
              defaultLanguage="cypher"
              value={field.value}
              onChange={field.onChange}
              theme="OneDarkPro"
              beforeMount={handleEditorDidMount}
              className="w-full h-96 rounded-lg border-2 border-slate-300 dark:border-slate-700 dark:bg-slate-800 overflow-hidden"
            />
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
};
