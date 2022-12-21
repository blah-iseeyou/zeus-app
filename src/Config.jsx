import { extendTheme, theme as nbTheme } from "native-base";
import Color from 'color'

//Marine
let primary = Color('#AB339F')

let lilac = Color('#A080C2')
let salmon = Color('#E798A9')

let warm = Color('#f4f6f6')

export const Config = {
    dependencies: {
        'linear-gradient': require('react-native-linear-gradient').default,
    },
}

export const Theme = extendTheme({
    colors: {
        primary: {
            50: primary.lighten(0.055).hex(),
            100: primary.lighten(0.111).hex(),
            200: primary.lighten(0.222).hex(),
            300: primary.lighten(0.333).hex(),
            400: primary.lighten(0.444).hex(),
            500: primary.lighten(0.555).hex(),
            600: primary.lighten(0.666).hex(),
            700: primary.lighten(0.777).hex(),
            800: primary.lighten(0.888).hex(),
            900: primary.hex()
        },
        lilac: {
            50: lilac.lighten(0.055).hex(),
            100: lilac.lighten(0.111).hex(),
            200: lilac.lighten(0.222).hex(),
            300: lilac.hex(),
            400: lilac.darken(0.333).hex(),
            500: lilac.darken(0.555).hex(),
            600: lilac.darken(0.666).hex(),
            700: lilac.darken(0.700).hex(),
            800: lilac.darken(0.750).hex(),
            900: lilac.darken(0.800).hex()
        },
        salmon: {
            50: salmon.lighten(0.055).hex(),
            100: salmon.lighten(0.111).hex(),
            200: salmon.lighten(0.222).hex(),
            300: salmon.lighten(0.333).hex(),
            400: salmon.lighten(0.555).hex(),
            500: salmon.lighten(0.444).hex(),
            600: salmon.hex(),
            700: salmon.darken(0.444).hex(),
            800: salmon.darken(0.555).hex(),
            900: salmon.darken(0.666).hex()
        },
    },

    fontConfig: {
        Poppins: {
            100: {
                normal: "Poppins-Thin",
                italic: "Poppins-ThinItalic",
            },
            200: {
                normal: "Poppins-ExtraLight",
                italic: "Poppins-ExtraLightItalic",
            },
            300: {
                normal: "Poppins-Light",
                italic: "Poppins-LightItalic",
            },
            400: {
                normal: "Poppins-Regular",
                italic: "Poppins-Italic",
            },
            500: {
                normal: "Poppins-Medium",
                italic: "Poppins-MediumItalic",
            },
            600: {
                normal: 'Poppins-SemiBold',
                italic: "Poppins-SemiBoldItalic",
            },
            700: {
                normal: 'Poppins-Bold',
                italic: "Poppins-BoldItalic",
            },
            800: {
                normal: 'Poppins-ExtraBold',
                italic: 'Poppins-ExtraBoldItalic',
            },
            900: {
                normal: 'Poppins-Black',
                italic: 'Poppins-BlackItalic',
            },
        },
    },
    fonts: {
        heading: "Poppins",
        body: "Poppins",
        mono: "Poppins",
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: 10,
                _light: {
                    bg: "primary.900",
                    borderRadius: 12,
                    // borderColor: "transparent"
                },
                _dark: {
                    bg: "primary.900",
                    borderRadius: 12,
                    // borderColor: "transparent"
                },
                size: "xl"
            }
        },
        Input: {
            baseStyle: {
                borderRadius: "10",
                _light: {
                    border: "none",
                    bg: "trueGray.200",
                    borderRadius: 8,
                    borderColor: "transparent"
                },
                _dark: {
                    bg: "trueGray.200",
                    borderRadius: 8,
                    borderColor: "transparent"
                },
                size: "xl"
            } 
        },
        Center: {
            variants: {
                'linear-gradient': ({
                    colorScheme,
                    colorMode,
                    ...args
                }) => ({
                    bg: {
                        linearGradient: {
                            colors: ['primary.900', 'lilac.300', 'salmon.800'],
                            start: { x: 0.5, y: 0.5 },
                            //end: {x: 1, y: 0.5},
                        },
                    }
                })
            }
        }
    }
})

export default {}