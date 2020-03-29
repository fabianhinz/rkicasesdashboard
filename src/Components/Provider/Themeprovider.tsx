import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { amber, teal } from '@material-ui/core/colors'
import { FC } from 'react'
import React from 'react'

const theme = createMuiTheme({
    palette: {
        primary: amber,
        secondary: teal,
        type: 'dark',
    },
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

const Themeprovider: FC = ({ children }) => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
    </ThemeProvider>
)

export default Themeprovider
