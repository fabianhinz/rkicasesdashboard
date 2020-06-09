import { Card, CardHeader, createStyles, makeStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { useEffect, useState } from 'react'

import { CombinedStateData } from '../../../model/model'
import { useConfigContext } from '../../Provider/ConfigProvider'
import ChartContainer from './ChartContainer'

const useStyles = makeStyles(theme =>
    createStyles({
        card: { position: 'relative', height: '100%' },
    })
)

interface ChartProps {
    state?: string
    data: CombinedStateData[]
    maxAxisDomain?: number
}

const Chart = (props: ChartProps) => {
    const [debouncing, setDebouncing] = useState(true)
    const { config } = useConfigContext()
    const classes = useStyles()

    useEffect(() => {
        setDebouncing(true)
        const timeout = setTimeout(() => setDebouncing(false), 1000)
        return () => {
            clearTimeout(timeout)
        }
    }, [props, config])

    return (
        <Card className={classes.card}>
            <CardHeader title={props.state || 'Deutschland'} />
            {debouncing ? (
                <Skeleton
                    variant="rect"
                    animation="wave"
                    width="100%"
                    height={config.settings.grid && config.enabledStates.size > 0 ? 300 : 600}
                />
            ) : (
                <ChartContainer data={props.data} maxAxisDomain={props.maxAxisDomain} />
            )}
        </Card>
    )
}

export default Chart
