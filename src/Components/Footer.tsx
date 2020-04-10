import { Grid, Link } from '@material-ui/core'
import React, { memo } from 'react'

const Footer = () => (
    <Grid container spacing={2}>
        <Grid item>
            <Link target="_blank" href="https://github.com/fabianhinz/rkicasesapi">
                Datenquelle
            </Link>
        </Grid>
        <Grid item>
            <Link target="_blank" href="https://github.com/fabianhinz/rkicasesdashboard">
                Quellcode
            </Link>
        </Grid>
        <Grid item>
            <Link target="_blank" href="https://www.flaticon.com/authors/freepik">
                Icons made by Freepik
            </Link>
        </Grid>
        <Grid item>
            <Link target="_blank" href="http://simplemaps.com/resources/svg-maps">
                Karte von simplemaps
            </Link>
        </Grid>
    </Grid>
)

export default memo(Footer)
