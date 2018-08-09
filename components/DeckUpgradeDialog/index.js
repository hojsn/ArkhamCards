import React from 'react';
import PropTypes from 'prop-types';
import { forEach, head, keys, range } from 'lodash';
import {
  ActivityIndicator,
  Alert,
  View,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import { showDeckModal } from '../navHelper';
import ExileCardSelectorComponent from '../ExileCardSelectorComponent';
import { updateCampaign } from '../campaign/actions';
import withTraumaDialog from '../campaign/withTraumaDialog';
import EditTraumaComponent from '../campaign/EditTraumaComponent';
import { upgradeDeck } from '../../lib/authApi';
import * as Actions from '../../actions';
import PlusMinusButtons from '../core/PlusMinusButtons';
import { getDeck, getCampaign } from '../../reducers';
import typography from '../../styles/typography';

class DeckUpgradeDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.number.isRequired,
    showNewDeck: PropTypes.bool,
    // Optional campaignId
    campaignId: PropTypes.number,
    // From redux, maybe
    updateCampaign: PropTypes.func.isRequired,
    deck: PropTypes.object,
    campaign: PropTypes.object,
    setNewDeck: PropTypes.func.isRequired,
    updateDeck: PropTypes.func.isRequired,
    investigator: PropTypes.object,
    showTraumaDialog: PropTypes.func.isRequired,
    investigatorDataUpdates: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const latestScenario = props.campaign && head(props.campaign.scenarioResults || []);
    const xp = latestScenario ? latestScenario.xp : 0;
    this.state = {
      xp,
      exileCounts: {},
      saving: false,
    };

    this._onXpChange = this.onXpChange.bind(this);
    this._onExileCountsChange = this.onExileCountsChange.bind(this);
    this._saveUpgrade = this.saveUpgrade.bind(this);

    props.navigator.setButtons({
      rightButtons: [
        {
          title: 'Save',
          id: 'save',
          showAsAction: 'ifRoom',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        this.saveUpgrade();
      }
    }
  }

  saveUpgrade() {
    const {
      navigator,
      investigator,
      deck: {
        id,
      },
      setNewDeck,
      updateDeck,
      campaign,
      updateCampaign,
      showNewDeck,
    } = this.props;
    this.setState({
      saving: true,
    });
    if (campaign) {
      updateCampaign(campaign.id, { investigatorData: this.investigatorData() });
    }
    const {
      xp,
      exileCounts,
    } = this.state;
    const exileParts = [];
    forEach(keys(exileCounts), code => {
      const count = exileCounts[code];
      if (count > 0) {
        forEach(range(0, count), () => exileParts.push(code));
      }
    });
    const exiles = exileParts.join(',');
    upgradeDeck(id, xp, exiles).then(decks => {
      const {
        deck,
        upgradedDeck,
      } = decks;
      updateDeck(deck.id, deck, false);
      setNewDeck(upgradedDeck.id, upgradedDeck);
      if (showNewDeck) {
        showDeckModal(navigator, upgradedDeck, investigator);
      } else {
        navigator.pop();
      }
    }, err => {
      Alert.alert(err.message || err);
    });
  }

  onCardPress(card) {
    this.props.navigator.push({
      screen: 'Card',
      passProps: {
        id: card.code,
        pack_code: card.pack_code,
      },
    });
  }

  onExileCountsChange(exileCounts) {
    this.setState({
      exileCounts,
    });
  }

  onXpChange(xp) {
    this.setState({
      xp: xp,
    });
  }

  investigatorData() {
    const {
      campaign,
      investigatorDataUpdates,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return Object.assign({}, campaign.investigatorData || {}, investigatorDataUpdates);
  }

  renderCampaignSection() {
    const {
      campaign,
      investigator,
      showTraumaDialog,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return (
      <View style={styles.labeledRow}>
        <EditTraumaComponent
          investigator={investigator}
          investigatorData={this.investigatorData()}
          showTraumaDialog={showTraumaDialog}
        />
      </View>
    );
  }

  render() {
    const {
      deck,
    } = this.props;
    const {
      xp,
      exileCounts,
      saving,
    } = this.state;
    if (!deck) {
      return null;
    }
    if (saving) {
      return (
        <View style={[styles.container, styles.saving]}>
          <Text style={typography.text}>
            Saving...
          </Text>
          <ActivityIndicator
            style={styles.savingSpinner}
            size="large"
            animating
          />
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.labeledRow}>
          <Text style={typography.small}>
            EXPERIENCE
          </Text>
          <View style={styles.row}>
            <Text style={typography.text}>
              { xp }
            </Text>
            <PlusMinusButtons
              count={xp}
              onChange={this._onXpChange}
            />
          </View>
        </View>
        { this.renderCampaignSection() }
        <ExileCardSelectorComponent
          id={deck.id}
          showLabel
          exileCounts={exileCounts}
          updateExileCounts={this._onExileCountsChange}
        />
      </ScrollView>
    );
  }
}


function mapStateToProps(state, props) {
  return {
    deck: getDeck(state, props.id),
    campaign: props.campaignId && getCampaign(state, props.campaignId),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, Actions, { updateCampaign }),
    dispatch
  );
}

export default withTraumaDialog(
  connect(mapStateToProps, mapDispatchToProps)(
    connectRealm(DeckUpgradeDialog, {
      schemas: ['Card'],
      mapToProps(results, realm, props) {
        return {
          investigator: head(results.cards.filtered(`code == '${props.deck.investigator_code}'`)),
        };
      },
    })
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  saving: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingSpinner: {
    marginTop: 16,
  },
  labeledRow: {
    flexDirection: 'column',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
