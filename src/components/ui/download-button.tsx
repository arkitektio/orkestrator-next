import * as React from "react";
import { Button, ButtonProps } from "./button";


const DownloadButton = React.forwardRef<HTMLButtonElement, ButtonProps & {url: string}>(
  ({ url,...props  }, ref) => {
    const handleDownload = async () => {
      if (!url) {
        alert("No URL provided");
        return;
      }
      try {
        console.log("Downloading from URL:", url);
        const result = await window.api.downloadFromUrl(url);
     
        if (result.success) {
          alert(`Downloaded to: ${result.path}`);
        } else {
          alert(`Download failed: ${result.error}`);
        }
      }
      catch (error) {
        alert(`Download failed: ${error}`);
        return;
      }
    };




    return (
      <Button
        ref={ref}
        onClick={handleDownload}
        {...props}
      />
    );
  },
);
DownloadButton.displayName = "Button";

export { DownloadButton };
