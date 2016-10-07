/**
 * Created by andrew on 10/7/16.
 */
import React, { Component } from 'react';
import { PageHeader, OverlayTrigger, Tooltip, Grid, Col, Row, Nav, NavItem, ButtonGroup, Button, Table } from "react-bootstrap";
import * as BS  from "react-bootstrap";
import Select from "react-select";
import Input from "../controls/bootstrap/Input";
import { moneyText } from '../components/Money';
import read from '../utils/readProp';
import * as A from '../actions/entities';
import AuxErrorLabel from "../controls/bootstrap/AuxErrorLabel";


const formValidation = (payload) => ['account', 'amount', 'description'].reduce((memo, prop) => {
  let result = [];
  const value = (payload[prop] || '').replace(/(^\s+)|(\s+$)/g, '');

  switch (prop) {
    case 'account':
    case 'amount':
      if (/^$/.test(value)) {
        result.push('required');
      }
  }

  switch (prop) {
    case 'amount':
      if (!/\d+/.test(value)) {
        result.push('need to be a number');
      }
  }

  switch (prop) {
    case 'description':
      if (value.length > 400) {
        result.push('need to be less than 400 symbols long');
      }

  }
  if (result.length) {
    memo[prop] = result;
    memo.hasErrors = true;
  }
  return memo;
}, {});


export class TransferForm extends Component {

  handleInput(key, value) {
    this.props.dispatch(A.makeTransferFormUpdate(key, value));
  }

  initiateTransfer(){
    const { dispatch, params, transfer } = this.props;
    const { accountId } = params;
    const { form } = transfer;

    // const payload = {
    //   account: form.account,
    //   amount: form.amount,
    //   description: form.description
    // };

    const validationErrors = formValidation(form);
    if (validationErrors.hasErrors) {
      this.props.dispatch(A.makeTransferError(validationErrors));
      return;
    }

    dispatch(A.makeTransfer(accountId, form ))
      .then(this.props.onAfterTransfer);
  }

  render() {

    const { params } = this.props;
    const { accountId } = params;
    const { entities, accounts } = this.props.data;


    // const  account = entities[accountId];

    const transferTo = [].concat(accounts.own.reduce((memo, item, idx) => {
        const { balance, title, accountId: itemAccountId } = item;

        if (itemAccountId != accountId) {
          memo.push({
            value: itemAccountId ,
            label: `${title}: ${ moneyText(balance) }`
          });
        }
        return memo;
      }, []),
      accounts.other.reduce((memo, item, idx) => {
        if (!((item.id == accountId) || (item.accountId == accountId))) {
          memo.push({
            value: item.accountId || item.id,
            label: `${item.title}${ item.description ? ': ' + item.description.substr(0, 10): '' }`
          });
        }
        return memo;
      }, []));

    const transferDisabled = this.props.transfer.loading;

    return (<Row className="transfer-form">
        <Col sm={4}>
          <label>Transfer To:</label>
          <div className="form-group">
            <Select
              className="transfer-account-dd"
              value={read(this.props.transfer, 'form.account', '')}
              clearable={true}
              options={transferTo}
              disabled={transferDisabled}
              onChange={this.handleInput.bind(this, 'account')}
            />
            <AuxErrorLabel
              label="Account:"
              errors={read(this.props.transfer, 'errors.account', []) || []}
            />
          </div>

        </Col>
        <Col sm={3}>
          <Input type="text"
                 className=""
                 label="Amount:"
                 placeholder="Amount"
                 name="amount"
                 addonBefore={
                   (<BS.Glyphicon glyph="usd" />)
                 }
                 addonAfter=".00"
                 disabled={transferDisabled}
                 value={read(this.props.transfer, 'form.amount', '')}
                 errors={read(this.props.transfer, 'errors.amount', []) || []}
                 onChange={this.handleInput.bind(this, 'amount')}
          />
        </Col>
        <Col sm={3}>
          <Input type="textarea"
                 className=""
                 label="Description:"
                 placeholder="Description"
                 name="description"
                 disabled={transferDisabled}
                 value={read(this.props.transfer, 'form.description', '') || ''}
                 errors={read(this.props.transfer, 'errors.description', []) || []}
                 onChange={this.handleInput.bind(this, 'description')}
          />
        </Col>
        <Col sm={2}>
          <br/>
          <Button bsStyle="primary"
                  disabled={transferDisabled}
                  onClick={!transferDisabled && this.initiateTransfer.bind(this)}>Transfer</Button>
        </Col>
      </Row>
    );
  };
}
