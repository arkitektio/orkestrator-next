import { BsCaretLeft, BsCaretRight } from "react-icons/bs";

export const ListOffsetter = ({
  offset,
  setOffset,
  step,
  array,
}: {
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  array?: any[] | undefined | null;
}) => (
  <>
    {offset != 0 && (
      <button
        type="button"
        className="hover:text-gray-200 transition-all "
        onClick={() => setOffset(offset - step > 0 ? offset - step : 0)}
      >
        {" "}
        <BsCaretLeft />{" "}
      </button>
    )}
    {array && array.length == step && (
      <button
        type="button"
        className="hover:text-gray-200 transition-all "
        onClick={() => setOffset(offset + step)}
      >
        {" "}
        <BsCaretRight />{" "}
      </button>
    )}
  </>
);

export const ListTitle = (props: {
  children: React.ReactNode;
  right?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div className="font-light text-xl dark:text-white justify-between flex flex-row py-1">
      <div className="flex-grow my-auto">{props.children}</div>
      {props.right && <div className="my-auto">{props.right}</div>}
    </div>
  );
};
