/**
 * Created by andrew on 12/02/16.
 */
import React from "react";
import { connect } from "react-redux";
import { Link, IndexLink } from "react-router";
import { PageHeader, OverlayTrigger, Tooltip, Grid, Col, Row, Nav, NavItem, ButtonGroup, Button, Table } from "react-bootstrap";
import { TransferForm } from '../components/TransferForm';
import { Money, moneyText } from '../components/Money';
import { TransfersTable } from '../components/TransfersTable';
import IndexPanel from "./../components/partials/IndexPanel";
import * as Modals from './modals';
import * as A from '../actions/entities';
import { blocked } from '../utils/blockedExecution';

const resetModals = {
  showAccountModal: false,
  unsaved: false
};

export class Account extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { ...resetModals };

    const ensureTransfers = this.ensureTransfers.bind(this);
    const ensureAccounts = this.ensureAccounts.bind(this);

    this.ensureTransfers = blocked(ensureTransfers, true);
    this.ensureAccounts = blocked(ensureAccounts, true);
  }

  ensureTransfers(props, cb) {
    const forceFetch = !cb;
    if (forceFetch) {
      cb = props;
      props = this.props;
    }

    const { dispatch, params, transfers } = props;

    if (!forceFetch && !params) {
      return cb();
    }

    const { accountId } = params;
    if (!forceFetch && (!accountId || transfers[accountId])) {
      return cb();
    }

    dispatch(A.getTransfers(accountId)).then(cb, cb);
  }

  ensureAccounts(props, cb) {
    const forceFetch = !cb;
    if (forceFetch) {
      cb = props;
      props = this.props;
    }

    const { dispatch, params, data } = props;

    if (!forceFetch && (!params || !data || !data.accounts)) {
      return cb();
    }

    const { accountId } = params;

    if (!forceFetch && data.accounts.own && data.accounts.own.length && data.entities[accountId]) {
      return cb();
    }

    if (!forceFetch && (!props.auth || !props.auth.user || !props.auth.user.attributes)) {
      return cb();
    }

    const {
      id: customerId
    } = props.auth.user.attributes;

    Promise.all([
      dispatch(A.fetchOwnAccounts(customerId)),
      dispatch(A.fetchAccount(accountId)),
    ]).then(cb, cb);
  }

  // shouldComponentUpdate(nextProps) {
  //   return (nextProps.params.accountId !== this.props.params.accountId) || (nextProps.app !== this.props.app);
  // }

  componentWillMount() {
    this.ensureAccounts(this.props);
    this.ensureTransfers(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.ensureAccounts(nextProps);
    this.ensureTransfers(nextProps);
  }


  close() {
    this.setState({
      ...resetModals
    });
  }


  render () {

    const { showAccountModal } = this.state;
    const { params } = this.props;
    const { loading, errors } = this.props.ui;
    const { entities, accounts } = this.props.data;
    const { accountId } = params;

    const  account = entities[accountId];

    const spinnerResult = (<h2 key="0">Loading..</h2>);

    if (loading) {
      return spinnerResult;
    }

    if (!account) {
      if (errors.length) {
        return (<div>
          <h2>Error loading specified account</h2>
          <div>Return <Link to="/">Home</Link> to pick another</div>
        </div>);
      } else {
        return spinnerResult;
      }
    }

    const onAfterTransfer = () => new Promise((rs) => {
      setTimeout(() => {
        this.ensureAccounts();
        this.ensureTransfers();
        rs();
      }, 1500);
    });
    const { title: titleRaw, description: descriptionRaw, balance } = account;

    const title = titleRaw || '—';
    const description = descriptionRaw || '—';


    return (
      <div key={accountId}>
        <PageHeader>
          Account
          <Nav pullRight={true}>
            <ButtonGroup>
              <Button bsStyle="link" onClick={ null } disabled={true}>Edit</Button>
            </ButtonGroup>
          </Nav>
        </PageHeader>

        <Row>
          <IndexPanel header="Account Info:">

            <Row>
              <Col xs={4}>Title:</Col>
              <Col xs={8}><strong>{ title }</strong></Col>
            </Row>

            <Row>
              <Col xs={4}>Balance:</Col>
              <Col xs={8}><strong><Money amount={balance} /></strong></Col>
            </Row>

            <Row>
              <Col xs={4}>Description:</Col>
              <Col xs={8}><strong>{ description }</strong></Col>
            </Row>

          </IndexPanel>

        </Row>
        <Row>
          <Col xs={12}>
            <h3>You can transfer money to accounts:</h3>
          </Col>
        </Row>
        <TransferForm {...this.props} onAfterTransfer={ onAfterTransfer } />
        <Row>
          <Col xs={12}>
            <h3>Transfer History:</h3>
          </Col>
        </Row>

        <TransfersTable forAccount={accountId} transfers={ this.props.transfers[accountId] } />

        <Modals.NewAccountModal show={showAccountModal}
                                action={ null }
                                account={{ loading: true }}
                                onHide={this.close.bind(this)}
                                key={0} />


      </div>

    );
  }
}

export default connect(({
  app,
  router
  }) => ({
    app,
  auth: app.auth,
  data: app.data,
  transfers: app.data.transfers,
  ui: app.ui.account,
  transfer: app.ui.transfersMake,
  router
}))(Account);