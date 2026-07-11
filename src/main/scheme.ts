// Custom privileged scheme used to serve the packaged renderer. Serving over a
// `standard` + `secure` scheme (instead of file://) gives the document a real,
// non-opaque tuple origin and secure-context status, which is what lets the
// COOP/COEP headers actually enable window.crossOriginIsolated — and therefore
// SharedArrayBuffer — in the packaged app. file:// can never satisfy this.
export const APP_SCHEME = "app";
export const APP_ORIGIN = `${APP_SCHEME}://bundle`;
