// build/notarize.mjs
import { notarize } from '@electron/notarize';

export default async function notarizeApp(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  console.log(`🔐 Notarizing: ${appPath}`);

  await notarize({
    appPath,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD, // App-specific password
    teamId: process.env.APPLE_TEAM_ID, // Example: DSPWX5YZ7H

  });

  console.log("✅ Notarization complete!");
}
