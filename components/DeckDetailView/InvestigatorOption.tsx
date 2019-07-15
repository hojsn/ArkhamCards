import React from 'react';
import { indexOf } from 'lodash';
import { t } from 'ttag';

import FactionSelectPicker from './FactionSelectPicker';
import { DeckMeta } from '../../actions/types';
import Card from '../../data/Card';
import DeckOption from '../../data/DeckOption';

interface Props {
  investigator: Card;
  option: DeckOption;
  meta: DeckMeta;
  setMeta: (key: string, value: string) => void;
}

export default class InvestigatorOptionsModule extends React.Component<Props> {
  _onChange = (selection: string) => {
    const {
      option,
      setMeta,
    } = this.props;
    if (option.faction_select && option.faction_select.length) {
      setMeta('faction_selected', selection);
    }
  };

  render() {
    const {
      investigator,
      option,
      meta,
    } = this.props;
    if (option.faction_select && option.faction_select.length) {
      const selection = (
        meta.faction_selected &&
        indexOf(option.faction_select, meta.faction_selected) !== -1
      ) ? meta.faction_selected : option.faction_select[0];
      return (
        <FactionSelectPicker
          name={option.name() || t`Select Faction`}
          factions={option.faction_select}
          onChange={this._onChange}
          selection={selection}
          investigatorFaction={investigator.faction_code}
        />
      );
    }
    // Don't know how to render this 'choice'.
    return null;
  }
}
