const fs = require("fs");
const path = require("path");

exports.default = async function (context) {
  const appName = `${context.packager.appInfo.productFilename}.app`;
  const root = path.join(context.appOutDir, appName);

  const frameworkResources = path.join(
    root,
    "Contents/Frameworks/Electron Framework.framework/Versions/A/Resources"
  );

  if (!fs.existsSync(frameworkResources)) return;

  const entries = await fs.promises.readdir(frameworkResources);

  for (const entry of entries) {
    if (entry.endsWith(".lproj")) {
      const folder = path.join(frameworkResources, entry);
      const pak = path.join(folder, "locale.pak");

      if (fs.existsSync(pak)) {
        console.log("Removing locale:", pak);
        await fs.promises.unlink(pak);
      }
    }
  }
};
