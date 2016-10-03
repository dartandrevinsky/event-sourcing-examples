const mainCommands = {
  createAccount({ title, amount, description }, waitToHide) {
    this
      .waitForElementVisible('@modalCreateAccountHook')
      .click('@modalCreateAccountHook');

    this.api.pause(500);
    this.waitForElementVisible('@modalCreateAccountModal')
      .waitForElementVisible('@modalCreateAccountForm')
      .setValue('@modalCreateAccountTitle', title)
      .setValue('@modalCreateAccountAmount', amount)
      .setValue('@modalCreateAccountDescription', description)
      .click('@modalCreateAccountSubmit');

    if (waitToHide) {
      this.waitForElementNotPresent('@modalCreateAccountModal');
      this.api.pause(1500);
    }
    return this;
  },

  createRef({ userQuery, accountQuery, title, description }, client, waitToHide) {

    this
      .waitForElementVisible('@modalCreateRefHook')
      .click('@modalCreateRefHook');

    this.waitForElementVisible('@modalCreateRefModal')
      .waitForElementVisible('@modalCreateRefForm')
      .waitForElementVisible('@modalCreateRefCustomerField');

    if (userQuery) {
      this
        .click('.Select.ref-create-owner .Select-control .Select-arrow-zone')
        // .click('//*[contains(@class, \'Select\')][contains(@class, \'ref-create-owner\')]//*[contains(@class, \'Select-arrow-zone\')]');
        .waitForElementVisible('.Select.ref-create-owner.is-open.is-focused .Select-menu-outer > .Select-menu')
        .waitForElementVisible('.Select.ref-create-owner .Select-control .Select-input > input')
        .setValue('.Select.ref-create-owner .Select-control .Select-input > input', userQuery.split(''))
        .waitForElementVisible('.Select.ref-create-owner.is-open.is-focused .Select-menu-outer > .Select-menu > .Select-option:first-child')
        .click('.Select.ref-create-owner.is-open.is-focused .Select-menu-outer > .Select-menu > .Select-option:first-child');

      this.api.pause(1500);
    }

    if (accountQuery) {
      this
        .click('.Select.ref-create-account .Select-control .Select-arrow-zone')
        .waitForElementVisible('.Select.ref-create-account.is-open.is-focused .Select-menu-outer > .Select-menu > .Select-option:first-child')
        .click('.Select.ref-create-account.is-open.is-focused .Select-menu-outer > .Select-menu > .Select-option:first-child');
    }

    this
      .clearValue('@modalCreateRefTitle')
      .setValue('@modalCreateRefTitle', title)
      .setValue('@modalCreateRefDescription', description)
      .click('@modalCreateRefSubmit');

    if (waitToHide) {
      this.waitForElementNotPresent('@modalCreateRefModal');
      this.api.pause(1500);
    }

    return this;
  },

  selectFirstAccount() {
    return this
      .waitForElementVisible('@firstAccountLink')
      .click('@firstAccountLink')
      .waitForElementNotPresent('@firstAccountLink');
  },

  signOut() {
    this
      .waitForElementVisible('@signOutLink')
      .click('@signOutLink');
    return this.waitForElementNotPresent('@signOutLink');
  }
};

export default {
  url: 'http://localhost:8080/#/',
  commands: [ mainCommands ],
  elements: {
    signOutLink: {
      selector: '//li/a[text()=\'Sign Out\']',
      locateStrategy: 'xpath'
    },
    modalCreateAccountHook: {
      selector: '//div/button[1][text()=\'Create Account\']',
      locateStrategy: 'xpath'
    },
    modalCreateAccountModal: {
      selector: '.modal-dialog'
    },
    modalCreateAccountForm: {
      selector: 'form.account-create-form'
    },
    modalCreateAccountTitle: {
      selector: 'form.account-create-form input[name=title]'
    },
    modalCreateAccountAmount: {
      selector: 'form.account-create-form input[name=balance]'
    },
    modalCreateAccountDescription: {
      selector: 'form.account-create-form textarea[name=description]'
    },
    modalCreateAccountSubmit: {
      selector: '.modal-dialog button[type=submit]'
    },
    modalCreateAccountErrors: {
      selector: 'form.account-create-form .inline-error-item'
    },
    modalCreateRefHook: {
      selector: '//div/button[2][text()=\'Add 3rd Party Recipients\']',
      locateStrategy: 'xpath'
    },
    modalCreateRefModal: {
      selector: '.modal-dialog'
    },
    modalCreateRefForm: {
      selector: 'form.account-create-ref'
    },
    modalCreateRefCustomerField: {
      selector: 'form.account-create-ref .Select.is-searchable'
      // selector: 'form.account-create-ref .Select.is-searchable div.Select-input'
    },
    modalCreateRefCustomerInput: {
      selector: 'form.account-create-ref .Select.is-searchable div.Select-input > input'
    },
    modealCreateRefCustomerOpen: {
      selector: 'form.account-create-ref .Select.is-searchable.is-open.is-focused div.Select-menu-outer > div.Select-menu' //has-value
    },
    modealCreateRefDDOption: {
      selector: 'form.account-create-ref .Select.is-searchable.is-open.is-focused div.Select-menu-outer > div.Select-menu > div.Select-option' //has-value
    },
    modalCreateRefAccount: {
      selector: 'form.account-create-ref .Select:not(.is-searchable) div.Select-input'
    },
    modalCreateRefTitle: {
      selector: 'form.account-create-ref input[name=title]'
    },
    modalCreateRefDescription: {
      selector: 'form.account-create-ref textarea[name=description]'
    },
    modalCreateRefSubmit: {
      selector: '.modal-dialog button[type=submit]'
    },
    modalCreateRefErrors: {
      selector: 'form.account-create-ref .inline-error-item'
    },
    accountLink: {
      selector: 'a[href^=\'#/account/\']'
    },
    firstAccountLink: {
      selector: '(//a[starts-with(@href, "#/account/")])[1]',
      locateStrategy: 'xpath'
    },
    secondAccountLink: {
      selector: '(//a[starts-with(@href, "#/account/")])[2]',
      locateStrategy: 'xpath'
    },
    refAccountBtn: {
      selector: '//table/tbody/tr/td/button[@disabled]',
      locateStrategy: 'xpath'
    },
  }
};