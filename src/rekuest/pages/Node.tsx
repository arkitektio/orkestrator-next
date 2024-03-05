import { ModelPageLayout } from "@/components/layout/ModelPageLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DetailPane,
  DetailPaneDescription,
  DetailPaneHeader,
  DetailPaneTitle,
} from "@/components/ui/pane";
import { NodeKind, useConstantNodeQuery } from "@/rekuest/api/graphql";
import {
  portToLabel,
  usePostman,
  useWidgetRegistry,
  withRekuest,
} from "@jhnnsrs/rekuest-next";
import { useCallback } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { ArgsContainer } from "@/components/widgets/ArgsContainer";
import { Constants, TestConstants } from "@/reaktion/base/Constants";
import { Input } from "@/components/ui/input";

import ShadowRealm from "shadowrealm-api";
export const ReserveForm = (props: { node: string }) => {
  const { reserve } = usePostman();

  const form = useForm({
    defaultValues: {
      node: props.node,
    },
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((value) => {
            reserve(value);
          })}
          className="space-y-6"
        >
          <Button type="submit">Reserve</Button>
        </form>
      </Form>
    </>
  );
};

const function_label =
  "(v, values) => v > 65 || 'Value must be greater than 65'";

const buildValidators = (validators: string[]) => {
  return (v: any, values: any) => {
    let ream = new ShadowRealm();

    let json_values = JSON.stringify(values);
    let errors: (string | undefined)[] = [];

    for (let validator of validators) {
      let wrappedValidator = `(v, values) => {
        const func = ${validator};

        let json_values = JSON.stringify(values);

        return func(v, json_values);
      }`;

      let func = ream.evaluate(wrappedValidator) as (v: any, value: any) => any;

      errors.push(func(v, json_values));
    }

    const filtered_errors = errors.filter((e) => e?.length && e.length > 0);
    if (filtered_errors.length > 0) {
      return filtered_errors.join(", ");
    }
    return undefined;
  };
};

export const WeirdField = (props: {
  name: string;
  default: any;
  validators: string[];
}) => {
  const form = useFormContext();

  const validator = useCallback(
    (v: any, values: any) => {
      let validator = buildValidators(props.validators);

      return validator(v, values);
    },
    [props.validators],
  );

  console.log("Reanderer");
  return (
    <FormField
      control={form.control}
      defaultValue={props.default}
      rules={{
        required: "This is required",
        validate: (v, values) => {
          return validator(v, values);
        },
      }}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.name}</FormLabel>
          <FormControl>
            <Input
              placeholder={"Enter Number"}
              {...field}
              onChange={(e) => {
                field.onChange(e);
              }}
              type="number"
            />
          </FormControl>
          <FormDescription>Hallo</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const WeirdForm = () => {
  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: any) => {
    console.log("submiting", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <WeirdField name={"Hallo"} default={6} validators={[function_label]} />
        <WeirdField
          name={"Karlo"}
          default={9}
          validators={[
            "(v,vx) => (vx.Hallo > 3 & v > 40) || 'This is not possible'",
          ]}
        />
        <button type="submit" className="btn">
          {" "}
          Submit{" "}
        </button>
      </form>
    </Form>
  );
};

export const NodeInfo = (props: { id: string }) => {
  const { data } = withRekuest(useConstantNodeQuery)({
    variables: {
      id: props.id,
    },
  });

  const { registry } = useWidgetRegistry();

  const copyHashToClipboard = useCallback(() => {
    navigator.clipboard.writeText(data?.node?.hash || "");
  }, [data?.node?.hash]);

  return (
    <ModelPageLayout identifier="@rekuest/node" object={props.id}>
      <DetailPane>
        <DetailPaneHeader>
          <DetailPaneTitle
            actions={
              <Button
                variant={"outline"}
                onClick={copyHashToClipboard}
                title="Copy to clipboard"
              >
                <ClipboardIcon />
              </Button>
            }
          >
            {data?.node?.name}
          </DetailPaneTitle>
          <DetailPaneDescription>
            {data?.node?.description}
            <div className="rounded shadow-md mt-2">
              {data?.node?.args && data?.node.args.length > 0 && (
                <div className="font-light mb-1"> Arguments </div>
              )}
              <div className="flex flex-col gap-2">
                {data?.node?.args?.map(portToLabel)}
              </div>
              {data?.node?.returns && data?.node.returns.length > 0 && (
                <div className="font-light mt-3 mb-1">
                  {" "}
                  {data?.node?.kind == NodeKind.Function
                    ? "Returns"
                    : "Streams"}{" "}
                </div>
              )}
              <div className="flex flex-col gap-2">
                {data?.node?.returns?.map(portToLabel)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {data?.node?.protocols?.map((p) => p.name)}
            </div>
          </DetailPaneDescription>
          <WeirdForm />
          <TestConstants ports={data?.node?.args || []} overwrites={{}} />
        </DetailPaneHeader>

        <Dialog>
          <DialogTrigger>Reserve</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reserve</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
              <ReserveForm node={props.id} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </DetailPane>
    </ModelPageLayout>
  );
};

function Page() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>Missing id</div>;
  }

  return (
    <>
      <NodeInfo id={id} />
    </>
  );
}

export default Page;
