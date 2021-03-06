import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import Button from 'components/Button';
import T from 'components/Typography';
import Animations, { FADE, SLIDE_Y } from 'hocs/Animations';
import { Layout, Body, Header, Footer } from 'components/Base';

const LANG_NEXT_TEXT = 'Next';

export default class Step1 extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.string).isRequired,
    saveAndContinue: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
    animateList: false,
    exitAnimation: false,
  };

  componentDidMount() {
    this.startListAnimation();
    this.setNavigation();
  }

  setNavigation = () => {
    this.props.navigation.setParams({
      leftAction: this.props.goBack,
      title: 'Create Wallet',
      multipage: true,
      currentPage: 2,
      totalPages: 3,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      this.startListAnimation();
    }
  }

  startListAnimation = () => {
    this.setState({ animateList: true });
  };

  animationDidFinish = () => {
    this.setState({ animateList: false });
  };

  handleNextButton = () => {
    this.setState({ animateList: false, exitAnimation: true });
  };

  handleGoBack = () => {
    this.setState(
      { animateList: false, exitAnimation: true },
      this.props.goBack()
    );
  };
  handleExitAnimation = () => {
    this.setState({ loading: true }, this.props.saveAndContinue);
  };

  render() {
    const { animateList, exitAnimation } = this.state;

    return (
      <Layout preload={false}>
        <Body scrollable style={styles.body}>
          <Header>
            <T.Heading style={styles.headingStyle}>Your Seed Words</T.Heading>
            <T.Light style={styles.text}>
              Write down each word in order and store it in a safe place.
              Seriously, do this!
            </T.Light>
          </Header>
          <Body>
            <Animations
              style={{ marginTop: 20 }}
              animations={[
                { type: FADE, parameters: { start: 0, end: 1 } },
                { type: SLIDE_Y, parameters: { start: 80, end: 0 } },
              ]}
              enterDelay={0}
              enterDuration={500}
              enterStagger={150}
              exitDelay={0}
              exitDuration={100}
              exitStagger={50}
              startAnimation={animateList}
              onEnterComplete={this.animationDidFinish}
              exitAnimation={exitAnimation}
              onExitComplete={this.handleExitAnimation}
            >
              {this.props.list.map((word, i) => {
                return (
                  <View key={`word-${i}`} style={styles.mnemonicChoice}>
                    <T.Light style={styles.mnemonicChoiceNumner}>
                      {`0${i + 7}`.slice(-2)}
                    </T.Light>
                    <T.SemiBold style={styles.mnemonicChoiceText}>
                      {word}
                    </T.SemiBold>
                  </View>
                );
              })}
            </Animations>
          </Body>
          <Footer>
            <T.Light
              style={{
                color: 'lightgrey',
                textAlign: 'center',
                paddingBottom: 10,
              }}
            >
              12 of 12 words
            </T.Light>
            <Button
              loading={this.state.loading}
              disabled={this.state.animateList || exitAnimation}
              onPress={this.handleNextButton}
            >
              {LANG_NEXT_TEXT}
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
  headerContainer: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#223252',
  },
  headingStyle: {
    padding: 20,
    paddingBottom: 0,
    color: '#ffffff',
  },
  text: {
    color: '#fff',
    fontWeight: '300',
    fontSize: 16,
  },
  bodyContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 0,
  },
  footerContainer: {
    paddingTop: 0,
    padding: 20,
  },
  mnemonicList: {},
  mnemonicChoice: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#22282F',
    opacity: 0.5,
    marginBottom: 20,
    flexDirection: 'row',
  },
  mnemonicChoiceNumner: {
    textAlign: 'center',
    color: '#ffffff',
    marginRight: 20,
    fontSize: 16,
  },
  mnemonicChoiceText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
  },
});
