/**
 * Dependencies for Remote Components
 */

import * as react from "react";
import * as reactDom from "react-dom";

const libs = {
  react: react,
  "react-dom": reactDom,
};

const resolve = () => libs;

export { resolve };
