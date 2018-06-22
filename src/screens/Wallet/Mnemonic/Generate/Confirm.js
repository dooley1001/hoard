import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import { Layout, Body, Header, Footer } from 'components/Base';
import Button from 'components/Button';
import T from 'components/Typography';
import LottieView from 'lottie-react-native';
import success from 'assets/animations/check.json';
import error from 'assets/animations/error.json';

const LANG_PREV_TEXT = 'Go back and review...';

export default class Confirm extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    saveWallet: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
    allChecksPassed: false,
    animateList: false,
    exitAnimation: false,
    0: { value: '', confirmed: false },
    1: { value: '', confirmed: false },
  };

  componentDidMount() {
    this.setNavigation();
  }

  setNavigation = () => {
    this.props.navigation.setParams({
      leftAction: this.props.goBack,
    });
  };

  updateFormField = fieldName => text => {
    this.setState({
      ...this.state,
      [fieldName]: {
        ...this.state[fieldName],
        value: text,
      },
    });
  };

  checkFields = key => {
    const valid = this.props.list[key].word === this.state[key].value;

    this.setState(
      {
        ...this.state,
        [key]: {
          ...this.state[key],
          confirmed: valid,
        },
      },
      () => this[`animation_${key}`].play()
    );

    this.checkFormState();
  };

  checkFormState = () => {
    if (
      this.props.list[0].word === this.state[0].value &&
      this.props.list[1].word === this.state[1].value
    ) {
      this.setState({ allChecksPassed: true });
    } else {
      this.setState({ allChecksPassed: false });
    }
  };

  handleCreate = () =>
    this.setState({ loading: true }, () => {
      this.props.navigation.setParams({ header: null });
      this.props.saveWallet();
    });

  render() {
    if (__DEV__) {
      //eslint-disable-next-line no-console
      console.log(
        'The words you need are',
        this.props.list[0].word,
        this.props.list[1].word
      );
    }
    const placeholderTextColor = 'white';

    return (
      <Layout preload={false}>
        <Body scrollable style={styles.body}>
          <Header>
            <T.Heading style={styles.headingStyle}>Confirm Word List</T.Heading>
          </Header>
          <Body>
            <T.Light style={styles.text}>
              To make sure everything was written down correctly, please enter
              the following words from your paper key.
            </T.Light>

            {this.props.list.map((word, i) => {
              const number = word.i + 1; // human readable numbers
              return (
                <View style={styles.inputRow} key={`confirm-${i}`}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      ref={el => (this.loginPasswordInput = el)}
                      style={styles.input}
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholder={`What was word #${number}`}
                      placeholderTextColor={placeholderTextColor}
                      returnKeyType="next"
                      onChangeText={this.updateFormField(i)}
                      onBlur={() => this.checkFields(i)}
                      editable={!this.state[i].confirmed}
                    />
                  </View>
                  <View style={styles.animationWrapper}>
                    <LottieView
                      source={this.state[i].confirmed ? success : error}
                      loop={false}
                      style={styles.animation}
                      ref={ref => {
                        this[`animation_${i}`] = ref;
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </Body>
          <Footer>
            <Button
              type="base"
              style={styles.statusCheck}
              onPress={this.handleCreate}
              loading={this.state.loading}
              disabled={!this.state.allChecksPassed}
            >
              Create My Wallet!
            </Button>
          </Footer>
        </Body>
      </Layout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 20,
  },
  inputRow: {
    marginTop: 20,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#353b48',
  },
  inputWrapper: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  animationWrapper: {},
  animation: {
    width: 70,
    height: 50,
  },
  text: {
    color: '#fff',
    fontWeight: '300',
    fontSize: 16,
  },
  input: {
    flexGrow: 1,
    color: 'white',
  },
  inputLable: {
    fontSize: 12,
    color: '#888888',
  },
  container: {
    flex: 1,
  },
  headingStyle: {
    padding: 20,
    paddingTop: 40,
    color: '#fff',
  },
  bodyContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 0,
  },
  statusCheck: {
    marginTop: 40,
  },
  footerContainer: {
    padding: 20,
  },
  mnemonicChoice: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#223252',
    marginBottom: 20,
    flexDirection: 'column',
  },
  mnemonicChoiceNumner: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 12,
  },
  mnemonicChoiceText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 14,
  },
  textButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});
