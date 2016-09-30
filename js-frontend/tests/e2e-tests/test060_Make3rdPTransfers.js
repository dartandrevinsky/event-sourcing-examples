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

    instancesPage
      .createAccount(globals.accountOne, true);
    // instancesPage
    //   .createAccount(globals.accountOne, true);

    instancesPage.expect.element('@firstAccountLink').to.be.visible;
    // instancesPage.expect.element('@secondAccountLink').to.be.visible;

    instancesPage.expect.element('@firstAccountLink').text.to.contain(globals.accountOne.title);
    // instancesPage.expect.element('@secondAccountLink').text.to.contain(globals.accountTwo.title);


    instancesPage.selectFirstAccount();
    client.assert.urlContains('/#/account/');

    const [ refAccountTitle ] = 'Johns`s Initial Account'.split('|');

    accountPage.makeTransfer(globals.transferTwo, true);

    accountPage.expect.element('@firstRowTypeCol').text.to.equal('Debit');
    accountPage.expect.element('@firstRowToCol').text.to.contain(refAccountTitle);
    accountPage.expect.element('@firstRowAmountCol').text.to.contain(globals.transferTwo.amount);
    accountPage.expect.element('@firstRowDescriptionCol').text.to.equal(globals.transferTwo.description);

    instancesPage
      .navigate()
      .signOut();

    client.assert.urlContains('/#/signin');

    client.end();
  }
};