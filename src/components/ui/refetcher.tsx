import { useState } from "react";
import { BiRefresh } from "react-icons/bi";

export const Refetcher = (props: { refetch: () => Promise<any> }) => {
  const [refetching, setRefetching] = useState(false);

  const onClick = () => {
    setRefetching(true);
    props.refetch().then(() => {
      setRefetching(false);
    });
  };

  return (
    <BiRefresh
      onClick={onClick}
      className={`hover:text-gray-200 transition-all cursor-pointer ${
        refetching ? "animate-spin" : ""
      } `}
    />
  );
};
