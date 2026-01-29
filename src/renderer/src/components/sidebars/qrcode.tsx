

import QRCode from "react-qr-code";

export const MyQRCode = (props: { object: string, identifier: string }) => {
  const url = `orkestrator://link/${props.identifier}/${props.object}`;

  return (
    <div className="border border-1 border-gray-200 rounded rounded-xl p-3 bg-white">
      <QRCode
        value={url}     // 👈 this is your HTTP/HTTPS URL
        // optional
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
    </div>
  );
}


export const QRCodeSidebar = (props: { identifier: string; object: string }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">QR Code</h2>
      {/* QR Code functionality goes here */}

      <MyQRCode identifier={props.identifier} object={props.object} />
    </div>
  );
}
