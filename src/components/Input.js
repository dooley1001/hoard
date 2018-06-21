import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  ViewPropTypes,
} from 'react-native';
import T from 'components/Typography';
import Icon from 'components/Icon';
import { Try } from 'components/Conditional';
import { colors } from 'styles';

export default class Input extends Component {
  static propTypes = {
    autoCapitalize: PropTypes.oneOf([
      'none',
      'sentences',
      'words',
      'characters',
    ]),
    keyboardType: PropTypes.oneOf(['numeric', 'email-address', 'default']),
    returnKeyType: PropTypes.oneOf(['done', 'go', 'next', 'search', 'send']),
    light: PropTypes.bool,
    placeholder: PropTypes.string.isRequired,
    containerStyle: ViewPropTypes.style,
    style: TextInput.propTypes.style,
    value: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func,
    onEndEditing: PropTypes.func,
    onBlur: PropTypes.func,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    multiline: PropTypes.bool,
    editable: PropTypes.bool,
    secureTextEntry: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: '',
    autoCapitalize: 'none',
    keyboardType: 'default',
    returnKeyType: 'done',
    multiline: false,
    error: false,
    editable: true,
    secureTextEntry: false,
    style: {},
    onSubmitEditing: () => false,
  };

  state = { active: false };

  inputRef = null;

  componentWillMount() {
    this._animatedIsActive = new Animated.Value(
      this.props.value === '' ? 0 : 1
    );
  }

  componentDidUpdate() {
    Animated.timing(this._animatedIsActive, {
      toValue: this.props.value !== '' ? 1 : 0,
      duration: 250,
    }).start();
  }

  setupInputRef = input => (this.inputRef = input);

  handleFocus = () =>
    this.setState({
      active: true,
    });

  handleBlur = () =>
    this.setState({
      active: false,
    });

  render() {
    const baseInputStyle =
      this.props.type === 'underline' ? styles.inputUnderline : styles.input;

    const activeStyle = this.state.active
      ? this.props.light
        ? styles.input_active_light
        : this.props.type === 'underline'
          ? styles.inputUnderline_active
          : styles.input_active
      : this.props.light
        ? styles.input_inactive_light
        : styles.input_inactive;
    const inputColors = this.props.light
      ? styles.input_light
      : styles.input_dark;

    const placeholderTextColor = this.props.light
      ? placeholderTextColorLight
      : placeholderTextColorDark;

    const errorBorder = this.props.error
      ? styles.input_errored
      : {};

    const labelStyle = {
      fontSize: 12,
      color: placeholderTextColor,
      opacity: this._animatedIsActive.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      top: this._animatedIsActive.interpolate({
        inputRange: [0, 1],
        outputRange: [5, 0],
      }),
    };

    return (
      <View
        style={[styles.input_wrapper, this.props.containerStyle]}
        accessible={true}
        accessibilityLabel={this.props.placeholder}
      >
        <Animated.Text style={labelStyle}>
          {this.props.placeholder}
        </Animated.Text>
        <TextInput
          {...this.props}
          editable={this.props.editable}
          style={[baseInputStyle, inputColors, activeStyle, errorBorder, this.props.style]}
          multiline={this.props.multiline}
          placeholder={this.props.placeholder}
          placeholderTextColor={colors.white}
          value={this.props.value}
          autoCapitalize={this.props.autoCapitalize}
          keyboardType={this.props.keyboardType}
          returnKeyType={this.props.returnKeyType}
          onChangeText={this.props.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          onEndEditing={this.props.onEndEditing}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          underlineColorAndroid="transparent"
          ref={this.setupInputRef}
          secureTextEntry={this.props.secureTextEntry}
          selectionColor={colors.active}
        />
        <Try condition={this.props.error && typeof this.props.error === 'string'}>
          <View>
            <View style={styles.errorContainer}>
              <View style={styles.errorIconContainer}>
                <View style={styles.errorIconUnderlay} />
                <Icon
                  style={{size: 17, color: '#ff6161',}}
                  icon="md-alert"
                />
              </View>
              <T.Small style={styles.errorText}>{this.props.error}</T.Small>
            </View>
          </View>
        </Try>
      </View>
    );
  }
}

const placeholderTextColorDark = 'rgba(255,255,255,0.5)';
const placeholderTextColorLight = 'rgba(0,0,0,0.4)';

const styles = StyleSheet.create({
  input_wrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,20, 0.25)',
    color: '#fff',
  },
  inputUnderline: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    color: '#fff',
  },
  inputUnderline_active: {
    borderBottomColor: '#49a7d9',
  },
  input_dark: {},
  input_active: {
    borderColor: colors.active,
    color: '#fff',
  },
  input_inactive: {
    borderBottomColor: colors.grayLight,
  },
  input_light: {
    backgroundColor: 'rgba(0,0,20, 0.05)',
    color: '#000',
  },
  input_active_light: {
    borderBottomColor: colors.active,
    color: '#000',
  },
  input_inactive_light: {
    borderColor: 'rgba(0,0,0, 0.4)',
  },
  input_errored: {
    borderColor: "#ff6161",
    borderBottomColor: "#ff6161",
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  errorIconContainer: {
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIconUnderlay: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 15,
    zIndex: -1,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#ff6161'
  },
});
