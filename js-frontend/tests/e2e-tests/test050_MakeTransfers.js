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


    instancesPage.selectFirstAccount();
    client.assert.urlContains('/#/account/');

    accountPage.makeTransfer(globals.transferOne, true);

    accountPage.expect.element('@firstRowTypeCol').text.to.equal('Debit');
    accountPage.expect.element('@firstRowToCol').text.to.equal(globals.accountTwo.title);
    accountPage.expect.element('@firstRowAmountCol').text.to.contain(globals.transferOne.amount);
    accountPage.expect.element('@firstRowDescriptionCol').text.to.equal(globals.transferOne.description);

    instancesPage
      .navigate()
      .signOut();

    client.assert.urlContains('/#/signin');

    client.end();
  }
};