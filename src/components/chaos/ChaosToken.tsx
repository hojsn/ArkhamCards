import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { RadialGradient } from 'react-native-gradients';
import { t } from 'ttag';

import { ChaosTokenType } from '@app_constants';
import StyleContext from '@styles/StyleContext';
import TokenIcon from '@icons/TokenIcon';
import AppIcon from '@icons/AppIcon';
import { TINY_PHONE } from '@styles/sizes';
import space from '@styles/space';

interface OwnProps {
  iconKey?: ChaosTokenType | 'tap' | 'another' | 'return' | 'odds' | 'bag' | 'more';
  size?: 'small' | 'tiny' | 'extraTiny';
  sealed?: boolean;
  shadow?: boolean;
  status?: 'added' | 'removed';
  total?: number;
}

type Props = OwnProps;

const CIRCLE_LARGE = TINY_PHONE ? 100 : 150;
export const SMALL_TOKEN_SIZE = TINY_PHONE ? 48 : 64;
export const TINY_TOKEN_SIZE = 48;
export const EXTRA_TINY_TOKEN_SIZE = 36;

const DEFAULT_GRADIENT = [
  { offset: '60%', color: '#FFFBF2' },
  { offset: '100%', color: '#D6CFB9' },
];

const GRADIENTS: { [token: string]: {offset: string; color: string}[] | undefined } = {
  frost: [
    { offset: '66%', color: '#3D3A63' },
    { offset: '100%', color: '#495483' },
  ],
  auto_fail: [
    { offset: '75%', color: '#8D181E' },
    { offset: '100%', color: '#6A0B10' },
  ],
  elder_sign: [
    { offset: '0%', color: '#33A1FB' },
    { offset: '50%', color: '#3C8AC9' },
    { offset: '100%', color: '#457398' },
  ],
  bless: [
    { offset: '25%', color: '#9C702A' },
    { offset: '100%', color: '#695823' },
  ],
  curse: [
    { offset: '25%', color: '#362330' },
    { offset: '100%', color: '#3B224A' },
  ],
};

function ChaosTokenPart({ name, size, color }: { name: string; size: number; color: string }) {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size }}>
      <TokenIcon name={name} size={size} color={color} />
    </View>
  );
}

function NormalChaosToken({ iconKey, size, shadowStyle, status }: {
  iconKey: ChaosTokenType | 'another' | 'return' | 'odds' | 'bag';
  size: number;
  shadowStyle?: ViewStyle;
  status?: 'added' | 'removed',
}) {
  const { colors } = useContext(StyleContext);
  const icon = useMemo(() => {
    if (iconKey) {
      switch (iconKey) {
        case 'another':
          return (
            <>
              <ChaosTokenPart name="tap_circle" color={colors.M} size={size} />
              <ChaosTokenPart name="token_plus_highlight" color={colors.D15} size={size} />
            </>
          );
        case 'return':
          return (
            <>
              <ChaosTokenPart name="token_symbol_fill" color="#FB4135" size={size} />
              <ChaosTokenPart name="token_dismiss_highlight" color="#FFFBF2" size={size} />
            </>
          );
        case 'odds':
          return (
            <>
              <ChaosTokenPart name="tap_circle" color={colors.M} size={size} />
              <ChaosTokenPart name="token_dismiss_highlight" color="#FC2323" size={size} />
            </>
          );
        case '+1':
          return (
            <>
              <ChaosTokenPart name="token_symbol_fill" color="#394852" size={size} />
              <ChaosTokenPart name="token_number_overlay" color="#ECBA59" size={size} />
              <ChaosTokenPart name="token_1_highlight" color="#FFFBF2" size={size} />
            </>
          );
        case '0':
        case '-1':
        case '-2':
        case '-3':
        case '-4':
        case '-5':
        case '-6':
        case '-7':
        case '-8':
          return (
            <>
              <ChaosTokenPart name="token_symbol_fill" color="#394852" size={size} />
              <ChaosTokenPart name="token_number_overlay" color="#E6E1D3" size={size} />
              <ChaosTokenPart name={`token_${iconKey}_highlight`} color="#FFFBF2" size={size} />
            </>
          );
        case 'skull':
        case 'cultist':
        case 'tablet':
        case 'elder_thing':
          return (
            <>
              <ChaosTokenPart name={`token_${iconKey === 'skull' ? 'symbol' : iconKey}_fill`} color={SPECIAL_COLORS[iconKey] || '#000000'} size={size} />
              <ChaosTokenPart name={`token_${iconKey}_overlay`} color="#E6E1D3" size={size} />
              <ChaosTokenPart name={`token_${iconKey}_highlight`} color="#FFFBF2" size={size} />
            </>
          );
        case 'auto_fail':
          return (
            <>
              <ChaosTokenPart name="token_auto_fail_overlay" color="#E6E1D3" size={size} />
              <ChaosTokenPart name="token_auto_fail_highlight" color="#8D181E" size={size} />
            </>
          );
        case 'elder_sign':
          return (
            <>
              <ChaosTokenPart name="token_elder_sign_overlay" color="#E6E1D3" size={size} />
              <ChaosTokenPart name="token_elder_sign_fill" color="#427DAD" size={size} />
              <ChaosTokenPart name="token_elder_sign_highlight" color="#E6E1D3" size={size} />
            </>
          );
        case 'frost':
          return (
            <>
              <ChaosTokenPart name="token_number_fill" color="#3D3A63" size={size} />
              <ChaosTokenPart name="token_frost_overlay" color="#E6E1D3" size={size} />
              <ChaosTokenPart name="token_frost_highlight" color="#FFFBF2" size={size} />
            </>
          );
        case 'bless':
          return (
            <>
              <ChaosTokenPart name="token_bless_fill" color="#9D702A" size={size} />
              <ChaosTokenPart name="token_bless_overlay" color="#E6E1D3" size={size} />
            </>
          );
        case 'curse':
          return (
            <>
              <ChaosTokenPart name="token_curse_fill" color="#35232F" size={size} />
              <ChaosTokenPart name="token_curse_overlay" color="#E6E1D3" size={size} />
            </>
          );
      }
    }
    return null;
  }, [iconKey, size, colors]);

  if (iconKey === 'another') {
    return (
      <View style={[
        { width: size, height: size, borderRadius: size / 2, overflow: 'hidden' },
      ]}>
        { icon }
      </View>
    );
  }
  const gradientParams = iconKey && GRADIENTS[iconKey];
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2 }, shadowStyle]}>
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', position: 'relative' }}>
        <RadialGradient
          style={{ width: size, height: size, borderRadius: size / 2 }}
          key={iconKey}
          colorList={gradientParams || DEFAULT_GRADIENT}
          x="50%"
          y="50%"
          rx="50%"
          ry="50%"
        />
        <View style={{ width: size, height: size, position: 'absolute', top: 0, left: 0 }}>
          { icon }
        </View>
        { status !== undefined && (
          <View style={{ position: 'absolute', top: 0, left: 0, borderRadius: size / 2, width: size, height: size,
            borderWidth: 2, borderColor: status === 'added' ? colors.faction.rogue.text : colors.faction.survivor.text }} />
        ) }
      </View>
    </View>
  );
}

function SealedChaosToken({ iconKey, size }: { iconKey: ChaosTokenType; size: number }) {
  const { colors } = useContext(StyleContext);
  const color = colors.token[iconKey] || colors.D20;
  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <ChaosTokenPart name="token_sealed_outline" color={color} size={size} />
      <ChaosTokenPart name={`token_${iconKey === '+1' ? 1 : iconKey}_sealed`} color={color} size={size} />
    </View>
  );
}


const SPECIAL_COLORS: { [token: string]: string | undefined } = {
  skull: '#552D2D',
  cultist: '#314629',
  tablet: '#294146',
  elder_thing: '#442946',
  auto_fail: '#7D1318',
  elder_sign: '#4477A1',
  bless: '#9D702A',
  curse: '#3A2342',
};

export function getChaosTokenSize(iconSize?: 'small' | 'tiny' | 'extraTiny') {
  if (!iconSize) {
    return CIRCLE_LARGE;
  }
  switch (iconSize) {
    case 'tiny': return TINY_TOKEN_SIZE;
    case 'small': return SMALL_TOKEN_SIZE;
    case 'extraTiny': return EXTRA_TINY_TOKEN_SIZE;
  }
}

export default function ChaosToken({ iconKey, size: iconSize, sealed, status, shadow: useShadow, total }: Props) {
  const { colors, typography, shadow } = useContext(StyleContext);
  const size = getChaosTokenSize(iconSize);
  if (!iconKey) {
    return <View style={[{ width: size, height: size }, styles.tapCircle]} />;
  }
  switch (iconKey) {
    case 'tap': {
      return (
        <View style={[{ width: size, height: size }, styles.tapCircle]}>
          <ChaosTokenPart name="tap_circle" color={colors.M} size={size} />
          <Text style={[
            typography.small,
            typography.italic,
            typography.center,
            typography.light,
            space.marginSideS,
          ]}>{t`Tap to draw`}</Text>
        </View>
      );
    }
    case 'more':
      return (
        <View style={{ width: size, height: size, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <View style={[{ width: size - 2, height: size - 2, borderRadius: (size - 2) / 2, backgroundColor: colors.L10 }, styles.tapCircle, shadow.small]}>
            { !!total && <Text style={[typography.small, typography.italic, typography.center, { color: colors.M }]}>{`×${total}`}</Text> }
          </View>
        </View>
      );
    case 'odds':
    case 'bag':
      return (
        <View style={{ width: size, height: size, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <View style={[{ width: size - 2, height: size - 2, borderRadius: (size - 2) / 2, backgroundColor: colors.L20 }, styles.tapCircle, shadow.small]}>
            <AppIcon name={iconKey === 'odds' ? 'difficulty' : 'chaos_bag'} color={colors.M} size={size / 1.8} />
          </View>
        </View>
      );
    case 'another':
    case 'return':
      return <NormalChaosToken iconKey={iconKey} size={size} shadowStyle={shadow.small} />;
    default:
      if (sealed) {
        return (
          <SealedChaosToken iconKey={iconKey} size={size} />
        );
      }
      return (
        <NormalChaosToken iconKey={iconKey} size={size} shadowStyle={useShadow ? shadow.drop : undefined} status={status} />
      );
  }
}

const styles = StyleSheet.create({
  tapCircle: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});