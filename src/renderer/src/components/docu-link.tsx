import { cn } from "@/lib/utils";

export const DOCUMENTATION_BASE_PATH = "https://arkitekt.live/docs/";

export const DocuLink = ({
  to,
  children,
  className,
}: { to: string; children: React.ReactNode, className?: string }) => {




  return (
    <div
      onClick={() => {
        window.api.openWebbrowser(DOCUMENTATION_BASE_PATH + to);
      }}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </div>
  );
}
