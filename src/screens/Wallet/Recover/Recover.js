import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, ScrollView } from "react-native";

import T from "components/Typography";
import { initializeWallet } from "../WalletInstances";
import SelectType from "./Type";
import SelectCoin from "../components/SelectCoin";
import InputList from "./InputList";
import PrivateKey from "./PrivateKey";
import Confirm from "./Confirm";
import NavigatorService from "lib/navigator";
import Modal from "../Modal";
import Button from "components/Button";

export default class Recover extends Component {
  static propTypes = {
    createWallet: PropTypes.func.isRequired,
    recoverWallet: PropTypes.func.isRequired,
    wallet: PropTypes.shape({
      create_successful: PropTypes.bool.isRequired
    }).isRequired
  };

  state = {
    step: 0,
    coin: null,
    isMnemonicPhrase: false,
    modalOpen: false,
    answers: {
      step1: Array.from({ length: 6 }, () => ""),
      step2: Array.from({ length: 6 }, () => "")
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.wallet.create_successful) {
      this.setState({ modalOpen: true });
    }
  }

  selectRecoveryOption = isMnemonicPhrase => () => {
    this.setState({ isMnemonicPhrase }, this.goForward);
  };

  selectCoin = coin => {
    if (__DEV__) {
      // eslint-disable-next-line
      console.log(
        "Test Recovery Phrase:",
        initializeWallet(coin)._wallet.mnemonic
      );

      // eslint-disable-next-line
      console.log(
        "Test Private Key:",
        initializeWallet(coin)._wallet.privateKey
      );
    }
    this.setState(
      {
        coin
      },
      this.goForward
    );
  };

  saveAnswers = step => stepAnswers => {
    this.setState({
      answers: {
        ...this.state.answers,
        [step]: stepAnswers
      }
    });
  };

  goForward = () => {
    const currentStep = this.state.step;
    const nextStep = currentStep < 4 ? currentStep + 1 : 1;

    this.setState({
      ...this.state,
      step: nextStep
    });
  };

  goBack = () => {
    this.setState({
      ...this.state,
      step: 2
    });
  };

  openModal = () => {
    this.setState({
      modalOpen: true
    });
  };

  cancelModal = () => {
    this.setState({
      modalOpen: false
    });
  };

  testWallet = answers => {
    initializeWallet(this.state.coin, true, answers.join(" "));
  };

  saveNewWallet = answers => {
    this.props.createWallet(this.state.coin, answers.join(" "));
    this.openModal();
  };

  recoverWallet = privateKey => {
    this.props.recoverWallet(this.state.coin, privateKey);
    this.openModal();
  };

  handleRedirect = () => {
    NavigatorService.navigateDeep([
      { routeName: "Menu" },
      { routeName: "Wallets" }
    ]);
  };

  getMnemonicComponentForStep = step => {
    if (step === 2) {
      return (
        <InputList
          offset={1}
          answers={this.state.answers.step1}
          updateAnswers={this.saveAnswers("step1")}
          saveAndContinue={this.goForward}
          onCancel={this.handleRedirect}
        />
      );
    }
    if (step === 3) {
      return (
        <InputList
          offset={this.state.answers.step1.length + 1}
          answers={this.state.answers.step2}
          updateAnswers={this.saveAnswers("step2")}
          saveAndContinue={this.goForward}
          onCancel={this.handleRedirect}
        />
      );
    }
    if (step === 4) {
      return (
        <Confirm
          answers={[...this.state.answers.step1, ...this.state.answers.step2]}
          testWallet={this.testWallet}
          saveWallet={this.saveNewWallet}
          goBack={this.goBack}
        />
      );
    }
  };

  getPrivateKeyComponentForStep = () => {
    return (
      <PrivateKey
        onSubmit={this.recoverWallet}
        onCancel={this.handleRedirect}
      />
    );
  };

  getComponentForStep = step => {
    if (step === 0) {
      return (
        <SelectType
          onPressPrivateKey={this.selectRecoveryOption(false)}
          onPressMnemonicPhrase={this.selectRecoveryOption(true)}
          handleCancel={this.handleRedirect}
        />
      );
    }

    if (step === 1) {
      return <SelectCoin saveAndContinue={this.selectCoin} />;
    }

    if (this.state.isMnemonicPhrase) {
      return this.getMnemonicComponentForStep(step);
    } else {
      return this.getPrivateKeyComponentForStep(step);
    }
  };

  render() {
    const { step, modalOpen } = this.state;

    return (
      <View style={styles.container}>
        {this.getComponentForStep(step)}
        <Modal
          show={modalOpen}
          title="Select Currency"
          onCancel={this.handleRedirect}
          onDone={this.handleRedirect}
        >
          <ScrollView bounces={false} style={styles.scrollView}>
            <View style={styles.headerContainer}>
              <T.Heading style={styles.headingStyle}>SUCCESS</T.Heading>
            </View>
            <View>
              <T.Light style={styles.headingStyle}>
                Paper key was confirmed!
              </T.Light>

              <Button type="secondary" onPress={this.handleRedirect}>
                Go To My Wallet
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#223252"
  },
  headingStyle: {
    color: "#ffffff"
  },
  bodyContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 0
  },
  refresh: {},
  footerContainer: {
    padding: 20
  },
  mnemonicList: {},
  mnemonicChoice: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#223252",
    marginBottom: 20,
    flexDirection: "column"
  },
  mnemonicChoiceNumner: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 12
  },
  mnemonicChoiceText: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 14
  },
  scrollView: {
    marginVertical: 10
  }
});