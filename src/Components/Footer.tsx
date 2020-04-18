import { AppBar, createStyles, Grid, Hidden, Link, makeStyles, Toolbar } from '@material-ui/core'
import React, { memo } from 'react'

const useStyles = makeStyles(theme =>
    createStyles({
        appbar: {
            bottom: 'calc(0px + env(safe-area-inset-bottom))',
            top: 'auto',
        },
        safeArea: {
            position: 'fixed',
            height: 'env(safe-area-inset-bottom)',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.palette.type === 'light' ? '#f5f5f5' : '#212121',
            zIndex: theme.zIndex.appBar + 1,
        },
    })
)

interface Props {
    lastUpdate?: string
}

const Footer = ({ lastUpdate }: Props) => {
    const classes = useStyles()

    return (
        <>
            <AppBar position="fixed" color="default" className={classes.appbar}>
                <Toolbar>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Link target="_blank" href="https://github.com/fabianhinz/rkicasesapi">
                                Daten vom {lastUpdate}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                target="_blank"
                                href="https://github.com/fabianhinz/rkicasesdashboard">
                                Quellcode
                            </Link>
                        </Grid>
                        <Hidden xsDown>
                            <Grid item>
                                <Link
                                    target="_blank"
                                    href="https://www.flaticon.com/authors/freepik">
                                    Icons made by Freepik
                                </Link>
                            </Grid>

                            <Grid item>
                                <Link
                                    target="_blank"
                                    href="http://simplemaps.com/resources/svg-maps">
                                    Karte von simplemaps
                                </Link>
                            </Grid>
                        </Hidden>
                    </Grid>
                </Toolbar>
            </AppBar>
            <div className={classes.safeArea} />
        </>
    )
}

export default memo(Footer, (prev, next) => prev.lastUpdate === next.lastUpdate)
