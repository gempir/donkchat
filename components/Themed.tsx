import * as React from 'react';
import { Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(colorName: keyof typeof Colors.light & keyof typeof Colors.dark) {
    const theme = useColorScheme();

    return Colors[theme][colorName];
}

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor('text');

    return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor('background');

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
