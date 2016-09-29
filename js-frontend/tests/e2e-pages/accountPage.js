/**
 * Created by andrew on 9/30/16.
 */
const accountCommands = {

  makeTransfer({selectAccount, amount, description}, waitComplete) {
    this
      .waitForElementVisible('.transfer-account-dd');

    if (selectAccount) {
      this
        .click('.Select.transfer-account-dd .Select-control .Select-arrow-zone')
        .waitForElementVisible('.Select.transfer-account-dd.is-open.is-focused .Select-menu-outer > .Select-menu')
        // .waitForElementVisible('.Select.transfer-account-dd .Select-control .Select-input > input')
        // .setValue('.Select.transfer-account-dd .Select-control .Select-input > input', userQuery.split(''))
        .waitForElementVisible('.Select.transfer-account-dd.is-open.is-focused .Select-menu-outer > .Select-menu > .Select-option:first-child')
        .click('.Select.transfer-account-dd.is-open.is-focused .Select-menu-outer > .Select-menu > .Select-option:first-child');

      this.api.pause(1500);
    }

    this
      .setValue('@transferAmount', amount)
      .setValue('@transferDescr', description)
      .click('@transferButton');

    if (waitComplete) {
      this.waitForElementVisible('@secondRow');
      this.api.pause(1500);
    }

    return this;
  }
};

export default {
  // url: 'http://localhost:8080/#/',
  commands: [ accountCommands ],
  elements: {
    transferAmount: {
      selector: 'input[type=text][name=amount]'
    },
    transferDescr: {
      selector: 'textarea[type=textarea][name=description]'
    },
    transferButton: {
      selector: '//button[@type=\'button\'][text()=\'Transfer\']',
      locateStrategy: 'xpath'
    },
    secondRow: {
      selector: '//table/tbody/tr[2]',
      locateStrategy: 'xpath'
    },
    firstRowTypeCol: {
      selector: '//table/tbody/tr[1]/td[2]',
      locateStrategy: 'xpath'
    },
    firstRowToCol: {
      selector: '//table/tbody/tr[1]/td[3]',
      locateStrategy: 'xpath'
    },
    firstRowAmountCol: {
      selector: '//table/tbody/tr[1]/td[4]',
      locateStrategy: 'xpath'
    },
    firstRowDescriptionCol: {
      selector: '//table/tbody/tr[1]/td[6]',
      locateStrategy: 'xpath'
    }
  }
};