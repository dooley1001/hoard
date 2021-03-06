import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ethers from 'ethers';

import Entropy from './Entropy';
import Step1 from './Step1';
import Step2 from './Step2';
import Confirm from './Confirm';

function getXItemsFromList(number, list) {
  let availableItems = list;
  const selectedItems = [];

  for (let i = 0; i < number; i++) {
    if (availableItems.length) {
      const selectedIndex = Math.floor(Math.random() * availableItems.length);
      const selectedItem = availableItems[selectedIndex];
      availableItems = [...availableItems.slice(0, selectedIndex), ...availableItems.slice(selectedIndex + 1)];
      selectedItems.push(selectedItem);
    } else {
      break;
    }
  }

  return selectedItems;
}

export default class Generate extends Component {
  static propTypes = {
    saveAndContinue: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  };

  state = {
    step: 1,
    mnemonic: ethers.Wallet.createRandom().mnemonic
  };

  generateNewMnemonic = (extraEntropy) => {
    this.setState({
      mnemonic: ethers.Wallet.createRandom({extraEntropy}).mnemonic
    }, this.nextStep);
  }

  generateConfirmationList = () => {
    const list = this.state.mnemonic.split(' ');
    return getXItemsFromList(2, list)
      .map(word => ({i: list.indexOf(word), word}))
      .sort((a, b) => a.i - b.i);
  };

  nextStep = () => {
    const currentStep = this.state.step;
    console.log(currentStep);
    const nextStep = currentStep <= 3 ? currentStep + 1 : 1;

    this.setState({
      step: nextStep
    });
  };

  goBack = () => {
    const step = this.state.step - 1;

    if (step === 0) {
      this.props.goBack();
    }

    this.setState({ step });
  }

  saveNewWallet = () => this.props.saveAndContinue(this.state.mnemonic);

  render() {
    const { step, mnemonic } = this.state;
    if (step === 1) {
      return (
        <Entropy
          goBack={this.goBack}
          saveAndContinue={this.generateNewMnemonic}
          navigation={this.props.navigation}
        />
      );
    }
    if (step === 2) {
      if (__DEV__) {
        //eslint-disable-next-line no-console
        console.log(
          'Generated List:',
          mnemonic.split(' ')
        );
      }
      const mnemonicList = mnemonic
        .split(' ')
        .slice(0, 6);
      return (
        <Step1
          list={mnemonicList}
          saveAndContinue={this.nextStep}
          goBack={this.goBack}
          navigation={this.props.navigation}
        />
      );
    }
    if (step === 3) {
      const mnemonicList = mnemonic
        .split(' ')
        .slice(6, 12);

      return (
        <Step2
          list={mnemonicList}
          saveAndContinue={this.nextStep}
          goBack={this.goBack}
          navigation={this.props.navigation}
        />
      );
    }
    if (step === 4) {
      const confirmList = this.generateConfirmationList();
      return (
        <Confirm
          list={confirmList}
          saveWallet={this.saveNewWallet}
          goBack={this.goBack}
          navigation={this.props.navigation}
        />
      );
    }
  }
}
