/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/**
 * Custom font families for the application
 * Inter - Used for titles, headings, and emphasis
 * Lato - Used for body text, secondary text, and small text
 */
export const FontFamily = {
  // Inter fonts - for titles and headings
  inter: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
  interBold: 'Inter_700Bold',
  interExtraBold: 'Inter_800ExtraBold',
  interBlack: 'Inter_900Black',

  // Lato fonts - for body and secondary text
  lato: 'Lato_400Regular',
  latoLight: 'Lato_300Light',
  latoMedium: 'Lato_400Regular', // Lato doesn't have 500, use 400
  latoSemiBold: 'Lato_700Bold', // Lato doesn't have 600, use 700
  latoBold: 'Lato_700Bold',
  latoBlack: 'Lato_900Black',

  // Italic variants
  latoItalic: 'Lato_400Regular_Italic',
  latoLightItalic: 'Lato_300Light_Italic',
  latoBoldItalic: 'Lato_700Bold_Italic',
};

export const Fonts = Platform.select({
  ios: {
    /** Primary font for titles and headings */
    title: FontFamily.inter,
    titleMedium: FontFamily.interMedium,
    titleSemiBold: FontFamily.interSemiBold,
    titleBold: FontFamily.interBold,
    /** Secondary font for body and small text */
    body: FontFamily.lato,
    bodyLight: FontFamily.latoLight,
    bodySemiBold: FontFamily.latoSemiBold,
    bodyBold: FontFamily.latoBold,
    /** Monospace for code */
    mono: FontFamily.lato,
  },
  default: {
    title: FontFamily.inter,
    titleMedium: FontFamily.interMedium,
    titleSemiBold: FontFamily.interSemiBold,
    titleBold: FontFamily.interBold,
    body: FontFamily.lato,
    bodyLight: FontFamily.latoLight,
    bodySemiBold: FontFamily.latoSemiBold,
    bodyBold: FontFamily.latoBold,
    mono: FontFamily.lato,
  },
  web: {
    title: "'Inter', sans-serif",
    titleMedium: "'Inter', sans-serif",
    titleSemiBold: "'Inter', sans-serif",
    titleBold: "'Inter', sans-serif",
    body: "'Lato', sans-serif",
    bodyLight: "'Lato', sans-serif",
    bodySemiBold: "'Lato', sans-serif",
    bodyBold: "'Lato', sans-serif",
    mono: "'Lato', monospace",
  },
});
