import { Button } from "@/components/ui/button";
import { withLokNext } from "@jhnnsrs/lok-next";
import {
  useAcknowledgeMessageMutation,
  useMyActiveMessagesQuery,
} from "./api/graphql";

export const SystemMessageDisplay = (props: {}) => {
  const { data, error } = withLokNext(useMyActiveMessagesQuery)();
  const [ack] = withLokNext(useAcknowledgeMessageMutation)({
    refetchQueries: ["MyActiveMessages"],
  });

  console.log("yyst", data, error);
  return (
    <>
      <div className="absolute top-0 right-0 h-screen w-screen ">
        {data?.myActiveMessages.map((message) => (
          <div
            key={message.id}
            className="p-2 rounded shadow-md bg-black opacity-99 p-2 text-white absolute w-full h-full z-100"
          >
            <div className="max-h-lg max-w-lg top-[50%] left-[50%] translate-x-[50%] translate-y-[50%] text-white  items-center align-center flex flex-col justify-between ">
              <div className="font-bold">{message.title}</div>
              <div>{message.message}</div>
              <Button
                onClick={() =>
                  ack({ variables: { id: message.id, ack: true } })
                }
              >
                Acknowledge
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
