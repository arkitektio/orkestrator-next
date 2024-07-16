export const SubTree = (props: { children }) => {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg ml-2 text-muted-foreground">
      {props.children}
    </div>
  );
};
