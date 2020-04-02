import { createMuiTheme, CssBaseline, PaletteType, ThemeProvider } from '@material-ui/core'
import { blue, green, lightBlue, lightGreen } from '@material-ui/core/colors'
import { FC, useContext, useEffect, useState } from 'react'
import React from 'react'

import { getOrThrow } from '../../services/db'

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
        primary: green,
        secondary: blue,
        type: 'light',
    },
})

const darkTheme = createMuiTheme({
    ...sharedTheme,
    palette: {
        primary: lightGreen,
        secondary: lightBlue,
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

    useEffect(() => {
        getOrThrow<PaletteType>('theme').then(setTheme).catch(console.error)
    }, [])

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
