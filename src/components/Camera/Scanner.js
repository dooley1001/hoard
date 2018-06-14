/*
  Code Taken & Modified from react-native-qr-scanner (https://github.com/shifeng1993/react-native-qr-scanner)
  MIT License
 */

import React, { PureComponent } from 'react';
import { RNCamera } from 'react-native-camera';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Vibration,
  Platform,
  PixelRatio,
  StatusBar,
} from 'react-native';

import QRScannerView from './ScannerView';
const pixelRatio = PixelRatio.get();

/**
 * 扫描界面
 */
export default class QRScanner extends PureComponent {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    this.state = {
      scanning: false,
      result: {},
      barCodeSize: {},
    };
  }

  static defaultProps = {
    onRead: () => {},
    renderTopView: () => {},
    renderBottomView: () => (
      <View style={{ flex: 1, backgroundColor: '#0000004D' }} />
    ),
    rectHeight: 200,
    rectWidth: 200,
    flashMode: false,
    finderX: 0,
    finderY: 0,
    zoom: 0,
    translucent: false,
    isRepeatScan: false,
  };

  handleOnRead = result => {
    this.setState({ result: result });
    this.props.onRead(result);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <RNCamera
          style={{
            flex: 1,
          }}
          onBarCodeRead={this._handleBarCodeRead}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          flashMode={
            !this.props.flashMode
              ? RNCamera.Constants.FlashMode.off
              : RNCamera.Constants.FlashMode.torch
          }
          zoom={this.props.zoom}
        >
          <QRScannerView
            maskColor={this.props.maskColor}
            cornerColor={this.props.cornerColor}
            borderColor={this.props.borderColor}
            rectHeight={this.props.rectHeight}
            rectWidth={this.props.rectWidth}
            borderWidth={this.props.borderWidth}
            cornerBorderWidth={this.props.cornerBorderWidth}
            cornerBorderLength={this.props.cornerBorderLength}
            isLoading={this.props.isLoading}
            cornerOffsetSize={this.props.cornerOffsetSize}
            isCornerOffset={this.props.isCornerOffset}
            bottomHeight={this.props.bottomHeight}
            scanBarAnimateTime={this.props.scanBarAnimateTime}
            scanBarColor={this.props.scanBarColor}
            scanBarHeight={this.props.scanBarHeight}
            scanBarMargin={this.props.scanBarMargin}
            hintText={this.props.hintText}
            hintTextStyle={this.props.hintTextStyle}
            scanBarImage={this.props.scanBarImage}
            hintTextPosition={this.props.hintTextPosition}
            isShowScanBar={this.props.isShowScanBar}
            finderX={this.props.finderX}
            finderY={this.props.finderY}
            returnSize={this.barCodeSize}
          />
        </RNCamera>
      </View>
    );
  }

  isShowCode = false;

  barCodeSize = size => this.setState({ barCodeSize: size });

  returnMax = (a, b) => (a > b ? a : b);

  returnMin = (a, b) => (a < b ? a : b);

  _handleBarCodeRead = e => {
    if (Platform.OS === 'ios') {
      let x = Number(e.bounds.origin.x);
      let y = Number(e.bounds.origin.y);
      let width = e.bounds.size.width;
      let height = e.bounds.size.height;
      let viewMinX = this.state.barCodeSize.x - this.props.finderX;
      let viewMinY = this.state.barCodeSize.y - this.props.finderY;
      let viewMaxX =
        this.state.barCodeSize.x +
        this.state.barCodeSize.width -
        width -
        this.props.finderX;
      let viewMaxY =
        this.state.barCodeSize.y +
        this.state.barCodeSize.height -
        height -
        this.props.finderY;
      if (x > viewMinX && y > viewMinY && (x < viewMaxX && y < viewMaxY)) {
        if (this.props.isRepeatScan) {
          Vibration.vibrate();
          this.handleOnRead(e);
        } else {
          if (this.state.result.data != e.data) {
            Vibration.vibrate();
            this.handleOnRead(e);
          }
        }
      }
    } else {
      if (
        !e.bounds[0].x ||
        !e.bounds[0].y ||
        !e.bounds[1].x ||
        !e.bounds[1].y ||
        !e.bounds[2].x ||
        !e.bounds[2].y ||
        !e.bounds[3].x ||
        !e.bounds[3].y
      )
        return null;
      const leftBottom = {
        x: e.bounds[0].x / pixelRatio,
        y: e.bounds[0].y / pixelRatio,
      };
      const leftTop = {
        x: e.bounds[1].x / pixelRatio,
        y: e.bounds[1].y / pixelRatio,
      };
      const rightTop = {
        x: e.bounds[2].x / pixelRatio,
        y: e.bounds[2].y / pixelRatio,
      };
      const rightBottom = {
        x: e.bounds[3].x / pixelRatio,
        y: e.bounds[3].y / pixelRatio,
      };
      let x = this.returnMin(leftTop.x, leftBottom.x);
      let y = this.returnMin(leftTop.y, rightTop.y);
      let width = this.returnMax(
        rightTop.x - leftTop.x,
        rightBottom.x - leftBottom.x
      );
      let height = this.returnMax(
        leftBottom.y - leftTop.y,
        rightBottom.y - rightTop.y
      );
      let viewMinX =
        this.state.barCodeSize.x -
        this.props.finderX * 4 / pixelRatio -
        (this.props.finderX > 0 ? this.props.finderX / 10 : 0);
      let viewMinY =
        this.state.barCodeSize.y -
        this.props.finderY * 4 / pixelRatio -
        (this.props.translucent ? 0 : StatusBar.currentHeight) *
          2 /
          pixelRatio -
        (this.props.finderY > 0
          ? this.props.finderY / 3
          : this.props.finderY / 10 * -1);
      let viewMaxX =
        this.state.barCodeSize.x +
        20 +
        this.state.barCodeSize.width * 2 / pixelRatio -
        width -
        this.props.finderX * 4 / pixelRatio -
        (this.props.finderX < 0 ? 0 : this.props.finderX / 5);
      let viewMaxY =
        this.state.barCodeSize.y +
        this.state.barCodeSize.height * 2 / pixelRatio -
        height -
        this.props.finderY * 4 / pixelRatio -
        (this.props.translucent ? 0 : StatusBar.currentHeight) *
          2 /
          pixelRatio -
        (this.props.finderY < 0 ? this.props.finderY / 5 : 0);
      if (x && y) {
        if (x > viewMinX && y > viewMinY && (x < viewMaxX && y < viewMaxY)) {
          if (this.props.isRepeatScan) {
            Vibration.vibrate();
            this.handleOnRead(e);
          } else {
            if (this.state.result.data != e.data) {
              Vibration.vibrate();
              this.handleOnRead(e);
            }
          }
        }
      }
    }
  };
}

QRScanner.propTypes = {
  isRepeatScan: PropTypes.bool,
  onRead: PropTypes.func,
  maskColor: PropTypes.string,
  borderColor: PropTypes.string,
  cornerColor: PropTypes.string,
  borderWidth: PropTypes.number,
  cornerBorderWidth: PropTypes.number,
  cornerBorderLength: PropTypes.number,
  rectHeight: PropTypes.number,
  rectWidth: PropTypes.number,
  isLoading: PropTypes.bool,
  isCornerOffset: PropTypes.bool,
  cornerOffsetSize: PropTypes.number,
  bottomHeight: PropTypes.number,
  scanBarAnimateTime: PropTypes.number,
  scanBarColor: PropTypes.string,
  scanBarImage: PropTypes.any,
  scanBarHeight: PropTypes.number,
  scanBarMargin: PropTypes.number,
  hintText: PropTypes.string,
  hintTextStyle: PropTypes.object,
  hintTextPosition: PropTypes.number,
  renderTopView: PropTypes.func,
  renderBottomView: PropTypes.func,
  isShowScanBar: PropTypes.bool,
  topViewStyle: PropTypes.object,
  bottomViewStyle: PropTypes.object,
  flashMode: PropTypes.bool,
  finderX: PropTypes.number,
  finderY: PropTypes.number,
  zoom: PropTypes.number,
  translucent: PropTypes.bool,
};
