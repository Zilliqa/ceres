require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'com.zilliqa.ceres',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_U,
    appleIdPassword: process.env.APPLE_PW,
  });
};