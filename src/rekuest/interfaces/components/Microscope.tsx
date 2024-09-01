import { useImagesQuery } from "@/mikro-next/api/graphql";
import { wrap } from "../wrap";
import { useState } from "react";
import { useGetStreamQuery } from "@/lok-next/api/graphql";

export const MicroscopeInner = () => {
  const { data } = useGetStreamQuery({
    variables: {
      id: 1,
    },
  });

  const [count, setCount] = useState(0);

  return (
    <h1 onClick={() => setCount((count) => count + 1)}>
      dd{JSON.stringify(data)}
      {count}
    </h1>
  );
};

const Microscope = wrap(MicroscopeInner);

customElements.define("my-microscope", Microscope);

export default Microscope;
