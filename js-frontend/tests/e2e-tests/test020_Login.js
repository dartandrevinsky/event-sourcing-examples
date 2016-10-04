import globals from '../e2e-globals/globals';

export default {
  '@tags': ['login', 'sanity'],

  'User Logs in': (client) => {
    const loginPage = client.page.loginPage();
    const instancesPage = client.page.instancesPage();

    const [email, pass] = '|'.split('|');

    loginPage
      .navigate()
      .login({email, pass});

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_020_${ globals.nextFilenameIdx() }.png`);

    loginPage.expect.element('@formError').to.be.visible;

    loginPage
      .navigate()
      .login(globals.userData);

    instancesPage.expect.element('@signOutLink').to.be.visible;

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_020_${ globals.nextFilenameIdx() }.png`);

    instancesPage
      .navigate()
      .signOut();

    client.assert.urlContains('/#/signin');

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_020_${ globals.nextFilenameIdx() }.png`);

    client.end();
  }
};