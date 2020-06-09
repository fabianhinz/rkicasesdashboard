import { Container, createStyles, makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'

import Actions from './Actions'
import Charts from './Charts/Charts'
import { useConfigContext } from './Provider/ConfigProvider'
import { useFirestoreContext } from './Provider/FirestoreProvider'
import Summary from './Summary/Summary'

const useStyles = makeStyles(theme =>
    createStyles({
        container: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
            userSelect: 'none',
        },
    })
)

const App = () => {
    const { firestoreData } = useFirestoreContext()
    const { config } = useConfigContext()

    const [maxAxisDomain, setMaxAxisDomain] = useState<number | undefined>(undefined)

    const classes = useStyles()

    useEffect(() => {
        if (config.enabledStates.size === 0) return

        const stateDomain: number | undefined = Array.from(firestoreData.byState.entries())
            .filter(([state]) =>
                config.enabledStates.size > 0 ? config.enabledStates.has(state) : true
            )
            .map(([_, data]) => data)
            .flat()
            .map(data =>
                Object.keys(data)
                    // ? defeat ts index signature...
                    .map(key => ((config.visibleCharts as any)[key] ? (data as any)[key] : false))
                    .filter(Boolean)
            )
            .flat()
            .sort((a, b) => b - a)[0]

        const recoveredDomain: number | undefined = firestoreData.recoveredToday
            .filter(
                ({ state }) => config.enabledStates.size === 0 || config.enabledStates.has(state)
            )
            .map(data => data.recovered)
            .sort((a, b) => b - a)[0]

        setMaxAxisDomain(Math.ceil(stateDomain || recoveredDomain))
    }, [
        config.enabledStates,
        config.visibleCharts,
        firestoreData.byState,
        firestoreData.recoveredToday,
    ])

    return (
        <>
            <Container className={classes.container} maxWidth="xl">
                <Summary />
                <Charts maxAxisDomain={maxAxisDomain} />
            </Container>
            <Actions />
        </>
    )
}

export default App
