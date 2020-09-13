import React from 'react';
import { find, filter, throttle } from 'lodash';
import { Platform, Text, StyleSheet, Switch, View } from 'react-native';
import { Navigation, EventSubscription, OptionsModalPresentationStyle } from 'react-native-navigation';
import { connect } from 'react-redux';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { Deck } from '@actions/types';
import Card from '@data/Card';
import { iconsMap } from '@app/NavIcons';
import { showDeckModal } from '@components/nav/helper';
import withFetchCardsGate from '@components/card/withFetchCardsGate';
import MyDecksComponent from './MyDecksComponent';
import { getMyDecksState, AppState } from '@reducers';
import COLORS from '@styles/colors';
import typography from '@styles/typography';
import { m, xs } from '@styles/space';

interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  myDecks: number[];
}

type Props = OwnProps & ReduxProps;

interface State {
  localDecksOnly: boolean;
}

class MyDecksView extends React.Component<Props, State> {
  static options() {
    return {
      topBar: {
        title: {
          text: t`Decks`,
        },
        rightButtons: [{
          icon: iconsMap.add,
          id: 'add',
          color: COLORS.navButton,
          testID: t`New Deck`,
        }],
      },
    };
  }

  _navEventListener?: EventSubscription;

  _showNewDeckDialog!: () => void;
  constructor(props: Props) {
    super(props);

    this.state = {
      localDecksOnly: false,
    };
    this._showNewDeckDialog = throttle(this.showNewDeckDialog.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  showNewDeckDialog() {
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'Deck.New',
            options: {
              modalPresentationStyle: Platform.OS === 'ios' ?
                OptionsModalPresentationStyle.overFullScreen :
                OptionsModalPresentationStyle.overCurrentContext,
            },
          },
        }],
      },
    });
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'add') {
      this._showNewDeckDialog();
    }
  }

  _deckNavClicked = (deck: Deck, investigator?: Card) => {
    showDeckModal(this.props.componentId, deck, investigator);
  };

  _toggleLocalDecksOnly = () => {
    this.setState({
      localDecksOnly: !this.state.localDecksOnly,
    });
  };

  renderCustomHeader() {
    const {
      myDecks,
    } = this.props;
    const {
      localDecksOnly,
    } = this.state;
    const hasLocalDeck = find(myDecks, deckId => deckId < 0) !== null;
    const hasOnlineDeck = find(myDecks, deckId => deckId > 0) !== null;
    if (!localDecksOnly && !(hasLocalDeck && hasOnlineDeck)) {
      // need to have both to show the toggle.
      return null;
    }
    return (
      <View style={styles.row}>
        <Text style={[typography.small, styles.searchOption]}>
          { t`Hide ArkhamDB Decks` }
        </Text>
        <Switch
          value={localDecksOnly}
          onValueChange={this._toggleLocalDecksOnly}
          trackColor={COLORS.switchTrackColor}
        />
      </View>
    );
  }

  renderCustomFooter() {
    return (
      <BasicButton
        title={t`New Deck`}
        onPress={this._showNewDeckDialog}
        grow
      />
    );
  }

  onlyDeckIds() {
    const {
      myDecks,
    } = this.props;
    if (this.state.localDecksOnly) {
      // @ts-ignore
      return filter(myDecks, deckId => parseInt(deckId, 10) < 0);
    }
    return undefined;
  }

  render() {
    return (
      <MyDecksComponent
        componentId={this.props.componentId}
        customHeader={this.renderCustomHeader()}
        customFooter={this.renderCustomFooter()}
        deckClicked={this._deckNavClicked}
        onlyDeckIds={this.onlyDeckIds()}
      />
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return getMyDecksState(state);
}

export default withFetchCardsGate(
  connect<ReduxProps, unknown, OwnProps, AppState>(mapStateToProps)(MyDecksView),
  { promptForUpdate: false },
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: xs,
    paddingBottom: xs,
    paddingLeft: m,
    paddingRight: m,
  },
  searchOption: {
    marginRight: 2,
  },
});
