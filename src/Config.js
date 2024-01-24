import { extendTheme, theme as nbTheme } from "native-base";
import Color from 'color'

//Marine
let primary = Color('#2DDA93')

let white = Color('#FFF')
let dark = Color('#000')

export const Config = {
    dependencies: {
        'linear-gradient': require('react-native-linear-gradient').default,
    },
}
// console.log( )

let linearGradientVariant = ({
    colorScheme,
    colorMode,
    ...args
}) => ({
    bg: {
        linearGradient: {
            colors: ['marine.900', 'lilac.300', 'salmon.800'],
            start: { x: 0.5, y: 0.5 },
            end: {x: 1, y: 0.5},
        },
    } 
})

export const Theme = () => extendTheme({
    colors: {
        primary: {
            50: primary.lighten(0.888).hex(),
            100: primary.lighten(0.777).hex(),
            200: primary.lighten(0.666).hex(),
            300: primary.lighten(0.555).hex(),
            400: primary.lighten(0.444).hex(),
            500: primary.lighten(0.333).hex(),
            600: primary.lighten(0.222).hex(),
            700: primary.lighten(0.111).hex(),
            800: primary.lighten(0.055).hex(),
            900: primary.hex()
        },
      
        whiteOpacity: {
            50: white.fade(0.05).hexa(),
            100: white.fade(0.1).hexa(),
            200: white.fade(0.2).hexa(),
            300: white.fade(0.3).hexa(),
            400: white.fade(0.4).hexa(),
            500: white.fade(0.5).hexa(),
            600: white.fade(0.6).hexa(),
            700: white.fade(0.7).hexa(),
            800: white.fade(0.8).hexa(),
            900: white.fade(0.9).hexa()
        },
        darkOpacity: {
            50:  dark.fade(0.05).hexa(),
            100: dark.fade(0.1).hexa(),
            200: dark.fade(0.2).hexa(),
            300: dark.fade(0.3).hexa(),
            400: dark.fade(0.4).hexa(),
            500: dark.fade(0.5).hexa(),
            600: dark.fade(0.6).hexa(),
            700: dark.fade(0.7).hexa(),
            800: dark.fade(0.8).hexa(),
            900: dark.fade(0.9).hexa()
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
                    _pressed: {
                        bg: "primary.700",
                    }
                    // borderColor: "transparent"
                },
                _dark: {
                    bg: "primary.900",
                    borderRadius: 12,
                    _pressed: {
                        bg: "primary.700",
                    }
                },
                size: "xl"
            }
        },
        Input: {
            baseStyle: {
                borderRadius: '10',
                _light: {

                    borderColor: "primary.900",
                    borderWidth: 1,
                    borderRadius: 8,
                },
                _dark: {
                    bg: "trueGray.200",
                    borderRadius: 8,
                    borderColor: "transparent"
                },
                _focus: {
                    borderColor: "primary.900",
                    borderWidth: 1,
                },
                size: "xl",
            } 
        },
        Center: {
            // variants: {
            //     'linear-gradient': linearGradientVariant
            // }
        },
        Box: {
            variants: {
                'layout': {
                    bg: "#F0F0F0",
                }
            }
        },
        ScrollView: {
            defaultProps: {
                _android: {
                    _contentContainerStyle: {
                        paddingBottom: 50 
                    }
                },
                _ios: {
                    _contentContainerStyle: {
                        paddingBottom: 180 
                    }
                }
            }
        }
    }
})

export default {}