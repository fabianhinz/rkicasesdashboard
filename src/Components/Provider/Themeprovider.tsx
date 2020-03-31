import { createMuiTheme, CssBaseline, PaletteType, ThemeProvider } from '@material-ui/core'
import { amber, teal } from '@material-ui/core/colors'
import { FC, useContext, useState } from 'react'
import React from 'react'

const sharedTheme = createMuiTheme({
    overrides: {
        MuiPaper: {
            rounded: { borderRadius: 20 },
        },
        MuiCardHeader: {
            root: {
                textAlign: 'center',
            },
        },
        MuiLink: {
            root: {
                fontSize: '1rem',
                fontFamily: 'Ubuntu',
            },
        },
        MuiTypography: {
            h5: {
                fontFamily: 'Ubuntu',
            },
        },
        MuiDialogActions: {
            root: {
                justifyContent: 'center',
            },
        },
    },
})

const lightTheme = createMuiTheme({
    ...sharedTheme,
    palette: {
        primary: amber,
        secondary: teal,
        type: 'light',
    },
})

const darkTheme = createMuiTheme({
    ...sharedTheme,
    palette: {
        primary: amber,
        secondary: teal,
        type: 'dark',
    },
})

interface ThemeContext {
    theme: PaletteType
    setTheme: React.Dispatch<React.SetStateAction<PaletteType>>
}

const Context = React.createContext<ThemeContext | null>(null)

export const useThemeContext = () => useContext(Context) as ThemeContext

const Themeprovider: FC = ({ children }) => {
    const [theme, setTheme] = useState<PaletteType>('dark')

    return (
        <Context.Provider value={{ theme, setTheme }}>
            <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </Context.Provider>
    )
}

export default Themeprovider
