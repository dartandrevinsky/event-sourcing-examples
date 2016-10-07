/**
 * Created by andrew on 9/30/16.
 */
import globals from '../e2e-globals/globals';

export default {
  '@tags': ['make transfers', 'account', 'sanity'],

  'User selects account': (client) => {
    const loginPage = client.page.loginPage();
    const instancesPage = client.page.instancesPage();
    const accountPage = client.page.accountPage();

    loginPage
      .navigate()
      .login(globals.userData);

    instancesPage.expect.element('@firstAccountLink').to.be.visible;
    instancesPage.expect.element('@secondAccountLink').to.be.visible;

    instancesPage.expect.element('@firstAccountLink').text.to.contain(globals.accountOne.title);
    instancesPage.expect.element('@secondAccountLink').text.to.contain(globals.accountTwo.title);

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_050_${ globals.nextFilenameIdx() }.png`);

    instancesPage.selectFirstAccount();
    client.assert.urlContains('/#/account/');

    const [ selectAccount, amount, description ] = '||'.split('|');

    accountPage.makeTransfer({
      selectAccount, amount, description
    });

    accountPage.expect.element('@transferFormErrors').to.be.visible;

    accountPage.makeTransfer(globals.transferOne, true);

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_050_${ globals.nextFilenameIdx() }.png`);

    accountPage.expect.element('@firstRowTypeCol').text.to.equal('Debit');
    accountPage.expect.element('@firstRowToCol').text.to.equal(globals.accountTwo.title);
    accountPage.expect.element('@firstRowAmountCol').text.to.contain(globals.transferOne.amount);
    accountPage.expect.element('@firstRowDescriptionCol').text.to.equal(globals.transferOne.description);

    instancesPage
      .navigate()
      .signOut();

    client.saveScreenshot(`./reports/SCREENSHOT_${ globals.seed }_050_${ globals.nextFilenameIdx() }.png`);

    client.assert.urlContains('/#/signin');

    client.end();
  }
};