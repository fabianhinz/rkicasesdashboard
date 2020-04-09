import { createStyles, makeStyles } from '@material-ui/core'
import { amber } from '@material-ui/core/colors'
import React from 'react'
import { RectangleProps } from 'recharts'

interface StyleProps extends Pick<BarShapeProps, 'fill'> {
    shouldHighlight: boolean
}

const useStyles = makeStyles(theme =>
    createStyles({
        barShape: {
            transition: theme.transitions.create('fill', {
                easing: theme.transitions.easing.easeOut,
            }),
            fill: ({ shouldHighlight, fill }: StyleProps) => (shouldHighlight ? amber.A400 : fill),
        },
    })
)

export type BarShapeProps = RectangleProps & { activeLabel?: number; index: number }

const BarShape = ({ x, y, width, height, fill, activeLabel, index }: BarShapeProps) => {
    const classes = useStyles({
        fill,
        shouldHighlight:
            activeLabel === index || activeLabel === index + 1 || activeLabel === index + 2,
    })

    if (!width || !height) return <></>

    return (
        <path className={classes.barShape} d={`M ${x},${y} h ${width} v ${height} h -${width} Z`} />
    )
}

export default BarShape
