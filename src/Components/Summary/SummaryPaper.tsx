import {
    Avatar,
    ButtonBase,
    Grid,
    Grow,
    makeStyles,
    Paper,
    Typography,
    useTheme,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

import { LEGEND } from '../../constants'
import { useConfigContext } from '../Provider/ConfigProvider'
import { useLayoutContext } from '../Provider/LayoutProvider'
import { SummaryChartData, useSummaryContext } from './Summary'

type StyleProps = Pick<Props, 'backgroundColor'> & {
    visible: boolean
    legend?: string
    percentage: boolean
}

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        minWidth: 160,
        width: '100%',
        transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.easeOut,
        }),
        backgroundColor: ({ backgroundColor, visible }: StyleProps) =>
            visible ? backgroundColor : theme.palette.background.paper,
        color: ({ backgroundColor, visible }: StyleProps) =>
            visible ? theme.palette.getContrastText(backgroundColor) : 'inherit',
    },
    avatar: {
        backgroundColor: ({ backgroundColor, visible }: StyleProps) =>
            visible ? backgroundColor : theme.palette.background.paper,
        color: ({ backgroundColor, visible }: StyleProps) =>
            visible ? theme.palette.getContrastText(backgroundColor) : 'inherit',
        filter: 'brightness(80%)',
    },
    buttonBase: {
        borderRadius: 20,
        width: '100%',
    },
    legend: {
        maxWidth: 120,
        margin: 'auto',
        marginTop: theme.spacing(0.5),
        height: 38,
    },
}))

interface Props {
    dataKey: keyof SummaryChartData
    onClick: () => void
    icon: JSX.Element
    backgroundColor: string
}

const SummaryPaper = ({ dataKey, onClick, icon, backgroundColor }: Props) => {
    const { config } = useConfigContext()
    const { summary, summaryPercent, summaryChartData } = useSummaryContext()
    const { layout } = useLayoutContext()
    const theme = useTheme()

    const legend = useMemo(() => {
        if (!config.settings.showLegend) return undefined
        return LEGEND[dataKey]
    }, [config.settings.showLegend, dataKey])

    const classes = useStyles({
        backgroundColor,
        visible: config.visibleCharts[dataKey] || layout === 'mobile',
        percentage: config.settings.percentage,
        legend,
    })

    if (!summary || !summaryPercent) return <Skeleton variant="text" width="100%" height={39} />

    return (
        <ButtonBase disabled={layout === 'mobile'} className={classes.buttonBase} onClick={onClick}>
            <Paper className={classes.paper}>
                <Grid
                    container
                    alignItems="center"
                    justify="space-between"
                    spacing={1}
                    wrap="nowrap">
                    <Grid item xs="auto">
                        <Avatar className={classes.avatar}>{icon}</Avatar>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography align="left" variant="h6">
                            {Number.isInteger(summary[dataKey])
                                ? summary[dataKey]
                                : summary[dataKey].toFixed(1)}
                        </Typography>
                        <Grow in={config.settings.percentage} mountOnEnter unmountOnExit>
                            <Typography align="left" component="div" variant="caption">
                                {summaryPercent[dataKey]}
                            </Typography>
                        </Grow>
                    </Grid>
                    {layout === 'mobile' && (
                        <Grid item xs={4}>
                            {layout === 'mobile' && Boolean(legend) && (
                                <Typography gutterBottom variant="caption">
                                    30 Tage Trend
                                </Typography>
                            )}
                            <ResponsiveContainer width="100%" aspect={3}>
                                <LineChart data={summaryChartData}>
                                    <Line
                                        type="monotone"
                                        dataKey={dataKey}
                                        stroke={theme.palette.getContrastText(backgroundColor)}
                                        dot={false}
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Grid>
                    )}
                </Grid>

                <Grow in={Boolean(legend)} mountOnEnter unmountOnExit>
                    <Typography
                        className={clsx(layout === 'desktop' && classes.legend)}
                        component="div"
                        align="center"
                        variant="caption">
                        {legend}
                    </Typography>
                </Grow>
            </Paper>
        </ButtonBase>
    )
}

export default SummaryPaper
