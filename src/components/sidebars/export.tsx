

import QRCode from "react-qr-code";




export const ExportSidebar = (props: { identifier: string; object: string }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">Export Options</h2>
      {/* Export options and functionality go here */}
      <p>Export data for {props.identifier} with ID {props.object}.</p>

    </div>
  );
}
