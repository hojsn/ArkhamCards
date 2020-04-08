import React from 'react';

import Card from 'data/Card';
import PickerStyleButton from './PickerStyleButton';
import { FACTION_COLORS } from 'constants';

interface Props {
  investigator: Card;
  value: string;
  widget?: React.ReactNode;
  disabled?: boolean;
  onPress: (code: string) => void;
}

export default function InvestigatorButton({
  investigator,
  value,
  widget,
  onPress,
  disabled,
}: Props) {
  return (
    <PickerStyleButton
      title={investigator.name}
      value={value}
      id={investigator.code}
      onPress={onPress}
      disabled={disabled}
      colors={{
        backgroundColor: FACTION_COLORS[investigator.factionCode()],
        textColor: '#FFF',
      }}
      widget={widget}
    />
  );
}
