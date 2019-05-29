import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import PlusMinusButtons from '../../core/PlusMinusButtons';
import Card from '../../../data/Card';
import { m } from '../../../styles/space';

interface Props {
  card: Card;
  index: number;
  count: number;
  onIncrement: (index: number) => void;
  onDecrement: (index: number) => void;
}

export default class CardUpgradeOption extends React.Component<Props> {
  _inc = () => {
    const {
      onIncrement,
      index,
    } = this.props;
    onIncrement(index);
  };

  _dec = () => {
    const {
      onDecrement,
      index,
    } = this.props;
    onDecrement(index);
  };

  render() {
    const {
      count,
      card,
    } = this.props;
    return (
      <View style={styles.buttonsRow}>
        <View style={styles.buttonLabel}>
          <Text style={styles.label}>
            { t`Level ${card.xp || 0}` }
          </Text>
        </View>
        <Text style={[styles.label, styles.countText]}>
          { count }
        </Text>
        <PlusMinusButtons
          count={count}
          limit={card.deck_limit || 2}
          onIncrement={this._inc}
          onDecrement={this._dec}
          size={36}
          dark
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: Platform.OS === 'ios' ? 28 : 8,
    paddingLeft: Platform.OS === 'ios' ? 28 : 8,
    marginBottom: m,
  },
  buttonLabel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  label: Platform.select({
    ios: {
      fontSize: 13,
      color: 'black',
    },
    android: {
      fontSize: 16,
      color: '#33383D',
    },
  }),
  countText: {
    fontWeight: '900',
    width: 30,
  },
});
