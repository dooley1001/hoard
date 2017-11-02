import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import Svg, {Polyline} from 'react-native-svg';

export default class SparkLine extends React.Component {
  state = {
    width: null,
    height: null
  }

  handleLayout = ({nativeEvent: {layout: {width, height}}}) => {
    this.setState({
      width: width ? width : Dimensions.get('window').width,
      height
    });
  }

  render() {
    const {width, height} = this.state;
    const {positive, children} = this.props;

    const maxValue = Math.max(...children);
    const minValue = Math.min(...children);
    const range = maxValue - minValue;
    const distance = width / (children.length - 1);
    const renderablePoints = children.map((v, i) => (
        {
        y: ( ( (v - minValue) * height ) / range ),
        x: distance * i + (i ? distance : 0)
        }
    )).map((v) =>  `${v.x},${-v.y + height}`);
    return (
        <View onLayout={this.handleLayout} style={styles.container}>
        {
          !width || !height ? null : (
              <Svg
                height={`${height}`}
                width={`${width}`}
              >
                <Polyline
                    points={renderablePoints.join(' ')}
                    fill="none"
                    stroke="red"
                    strokeWidth="1"
                />
              </Svg>
          )
        }
        </View>
    )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  dot: {
    marginRight: 2,
    marginLeft: 2,
  },
  dotPositive: {
    backgroundColor: 'green'
  },
  dotNegative: {
    backgroundColor: 'red'
  },
});
