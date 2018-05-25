/**
 *
 * Login Form
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Error from 'components/notifications/Error';
import Button from 'components/Button';
import Input from 'components/Input';
import NavigatorService from 'lib/navigator';

const LANG_SIGN_UP_TEXT = 'LOG IN';

class LoginForm extends Component {
  static propTypes = {
    navigation: PropTypes.any,
    loginRequest: PropTypes.func.isRequired,
    errors: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.number,
        message: PropTypes.string,
      })
    ),
  };

  state = {
    loading: false,
    loggedIn: false,
    error: false,
    username_or_email: null,
    password: null,
  };

  handleSignupButton = () => {
    NavigatorService.navigate('Signup');
  };

  handleBypassButton = () => {
    if (this.props.hasMnemonic) {
      NavigatorService.resetReplace('Login', 'Menu');
    } else {
      NavigatorService.navigate('Mnemonic');
    }
  };

  handleFormSubmit = () => {
    if (
      this.state.username_or_email &&
      this.state.username_or_email.length > 1 &&
      this.state.password &&
      this.state.password.length > 1
    ) {
      this.props.loginRequest({
        username_or_email: this.state.username_or_email,
        password: this.state.password,
      });
    }
  };

  updateFormField = fieldName => text => {
    this.setState({ [fieldName]: text });
  };

  safeFocus = element => _.invoke(element, 'inputRef.focus');

  render() {
    const { errors } = this.props;
    return (
      <View style={styles.container}>
        {errors.map(error => {
          return (
            <Error
              key={`error-${error.code}`}
              title="Oops!"
              message={error.message}
            />
          );
        })}
        <Input
          placeholder="Username or Email"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          keyboardType="email-address"
          onSubmitEditing={() => this.safeFocus(this.loginPasswordInput)}
          onChangeText={this.updateFormField('username_or_email')}
          value={this.state.username_or_email || ''}
          type="underline"
        />
        <View style={{ marginTop: 20 }}>
          <Input
            ref={el => (this.loginPasswordInput = el)}
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            keyboardType="default"
            secureTextEntry
            onSubmitEditing={this.handleFormSubmit}
            onChangeText={this.updateFormField('password')}
            value={this.state.password || ''}
            type="underline"
          />
        </View>
        <Button type="text" onPress={this.handleSignupButton}>
          New to Hoard? Sign Up!
        </Button>

        <View style={{ marginVertical: 20 }}>
          <Button type="primary" onPress={this.handleFormSubmit}>
            {LANG_SIGN_UP_TEXT}
          </Button>
        </View>
        <Button type="text" onPress={this.handleBypassButton}>
          No thanks, I just want to use the wallet
        </Button>
      </View>
    );
  }
}

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
