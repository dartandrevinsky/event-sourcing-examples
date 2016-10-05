/**
 * Created by andrew on 9/28/16.
 */
import globals from '../e2e-globals/globals';

export default {
  '@tags': ['create 3rd party accounts', 'sanity'],

  'User Creates 3rd Party Accounts': (client) => {
    const loginPage = client.page.loginPage();
    const signupPage = client.page.signupPage();
    const instancesPage = client.page.instancesPage();

    // Step 1: Setup 3rd Party & Accounts

    signupPage
      .navigate();

    client.assert.urlContains('/#/register');

    signupPage
      .signup(globals.otherUserData, true);

    client.assert.urlContains('/#/signin');

    loginPage
      .navigate()
      .login(globals.otherUserData);

    const [ userQuery, accountQuery, title, description ] = '|||'.split('|');

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_040_${ globals.nextFilenameIdx() }.png`);

    instancesPage
      .navigate()
      .createRef({ userQuery, accountQuery, title, description }, client, false);

    instancesPage.expect.element('@modalCreateRefErrors').to.be.visible;
    instancesPage.expect.element('@modalCreateRefForm').to.be.visible;

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_040_${ globals.nextFilenameIdx() }.png`);

    const [ refAccountTitle, refAccountDescription ] = 'Johns`s Initial Account|Johns`s Initial Account'.split('|');
    instancesPage
      .createRef({
        userQuery: globals.userData.email,
        accountQuery: globals.accountOne.title,
        title: refAccountTitle,
        description: refAccountDescription
      }, client, true);

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_040_${ globals.nextFilenameIdx() }.png`);

    instancesPage.expect.element('@modalCreateRefErrors').to.not.be.present;
    instancesPage.expect.element('@modalCreateRefForm').to.not.be.present;

    instancesPage.expect.element('@refAccountBtn').to.be.visible;
    instancesPage.expect.element('@refAccountBtn').text.to.contain(refAccountTitle.substr(0, 20));

    client.end();
  }
};