/**
 * Created by andrew on 9/30/16.
 */
import globals from '../e2e-globals/globals';

export default {
  '@tags': ['make 3rd party transfers', 'account', 'sanity'],

  'User selects account': (client) => {
    const loginPage = client.page.loginPage();
    const instancesPage = client.page.instancesPage();
    const accountPage = client.page.accountPage();

    loginPage
      .navigate()
      .login(globals.otherUserData);

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_060_${ globals.nextFilenameIdx() }.png`);

    instancesPage
      .createAccount(globals.accountOne, true);

    instancesPage.expect.element('@firstAccountLink').to.be.visible;
    // instancesPage.expect.element('@secondAccountLink').to.be.visible;

    instancesPage.expect.element('@firstAccountLink').text.to.contain(globals.accountOne.title);
    // instancesPage.expect.element('@secondAccountLink').text.to.contain(globals.accountTwo.title);

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_060_${ globals.nextFilenameIdx() }.png`);

    instancesPage.selectFirstAccount();
    client.assert.urlContains('/#/account/');

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_060_${ globals.nextFilenameIdx() }.png`);

    const [ refAccountTitle ] = 'Johns`s Initial Account'.split('|');

    accountPage.makeTransfer(globals.transferTwo, true);

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_060_${ globals.nextFilenameIdx() }.png`);

    accountPage.expect.element('@firstRowTypeCol').text.to.equal('Debit');
    accountPage.expect.element('@firstRowToCol').text.to.contain(refAccountTitle.substr(0, 20));
    accountPage.expect.element('@firstRowAmountCol').text.to.contain(globals.transferTwo.amount);
    accountPage.expect.element('@firstRowDescriptionCol').text.to.equal(globals.transferTwo.description);

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_060_${ globals.nextFilenameIdx() }.png`);

    instancesPage
      .navigate()
      .signOut();

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_060_${ globals.nextFilenameIdx() }.png`);

    client.assert.urlContains('/#/signin');

    client.end();
  }
};