const tintColorLight = '#00FF80';
const tintColorDark = '#00FF80';

export type ColorScheme = 'light' | 'dark';

const colors = {
    light: {
        text: '#000',
        background: '#fff',
        tint: tintColorLight,
        tabIconDefault: '#ccc',
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: '#fff',
        background: '#000',
        tint: tintColorDark,
        tabIconDefault: '#ccc',
        tabIconSelected: tintColorDark,
    },
};

export default colors;