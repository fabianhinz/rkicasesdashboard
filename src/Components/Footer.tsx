import { Grid, Link } from '@material-ui/core'
import React from 'react'

interface Props {
    lastUpdate?: Date
}

const Footer = ({ lastUpdate }: Props) => (
    <Grid container justify="center" spacing={2}>
        <Grid item>
            <Link target="_blank" href="https://github.com/fabianhinz/rkicasesapi">
                Datenquelle
                {lastUpdate && ` (${lastUpdate.toLocaleDateString()})`}
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

export default Footer
