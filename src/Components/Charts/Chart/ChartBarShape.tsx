import { makeStyles } from '@material-ui/core'
import { amber } from '@material-ui/core/colors'
import React from 'react'
import { RectangleProps } from 'recharts'

interface StyleProps extends Pick<ChartBarShapeProps, 'fill'> {
    shouldHighlight: boolean
    obsolete: boolean
}

const useStyles = makeStyles(theme => ({
    barShape: {
        transition: theme.transitions.create('fill', {
            easing: theme.transitions.easing.easeOut,
        }),
        fill: ({ shouldHighlight, fill }: StyleProps) => (shouldHighlight ? amber.A400 : fill),
        opacity: ({ obsolete }: StyleProps) => (obsolete ? 0.5 : 1),
    },
}))

export type ChartBarShapeProps = RectangleProps & { activeLabel?: number; index: number }

const ChartBarShape = ({ x, y, width, height, fill, activeLabel, index }: ChartBarShapeProps) => {
    const classes = useStyles({
        fill,
        shouldHighlight:
            activeLabel === index || activeLabel === index + 1 || activeLabel === index + 2,
        obsolete: Boolean(activeLabel && activeLabel < index),
    })

    if (!width || !height) return <></>

    return (
        <path className={classes.barShape} d={`M ${x},${y} h ${width} v ${height} h -${width} Z`} />
    )
}

export default ChartBarShape
