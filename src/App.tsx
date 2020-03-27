import React, { useEffect, useState } from 'react';
import 'firebase/firestore'
import firebase from 'firebase/app'
import { LineChart, ResponsiveContainer, Line, Tooltip, YAxis } from 'recharts'
import { Grid, CssBaseline, Box, Card, CardHeader, CardContent, ThemeProvider, createMuiTheme, Chip, Divider, Link, Container, makeStyles, createStyles, Paper, Typography, Fab } from '@material-ui/core'
import { red, teal, amber } from '@material-ui/core/colors';
import { Skull, Sigma, Percent, Calendar, UnfoldMoreHorizontal } from 'mdi-material-ui'
import Skeleton from '@material-ui/lab/Skeleton';
import clsx from 'clsx';

const firebaseConfig = {
  apiKey: "AIzaSyCiBLIlEJpEjuLCaDCc7Uk_CLEpnQW2340",
  authDomain: "rkicasesapi.firebaseapp.com",
  databaseURL: "https://rkicasesapi.firebaseio.com",
  projectId: "rkicasesapi",
  storageBucket: "rkicasesapi.appspot.com",
  messagingSenderId: "481742378960",
  appId: "1:481742378960:web:b29de00a3d8ddd79ec4bd5"
};

firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore()
firestore.enablePersistence({ synchronizeTabs: true })

interface RkiData {
  id: string
  state: string
  cases: number
  delta: string
  rate: number
  deaths: number
  mostAffected: string
  timestamp: firebase.firestore.Timestamp
}

interface TooltipProps {
  active: boolean
  payload: { color: string; value: any; payload: RkiData }[]
}

interface Summary {
  lastUpdate: Date
  cases: number
  deaths: number
  rate: number
}

type State = string
type CasesByState = Map<State, Omit<RkiData, "state">[]>

const createDateFromTimestamp = (timestamp: firebase.firestore.Timestamp) =>
  new firebase.firestore.Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()

const theme = createMuiTheme({
  palette: {
    primary: amber,
    secondary: teal,
    type: 'dark'
  },
  overrides: {
    MuiPaper: {
      rounded: { borderRadius: 20 }
    },
    MuiCardHeader: {
      root: {
        textAlign: 'center',

      },
    },
    MuiLink: {
      root: {
        fontSize: '1rem',
        fontFamily: 'Ubuntu'
      }
    },
    MuiTypography: {
      h5: {
        fontFamily: 'Ubuntu'
      },
    }
  }
})

const useStyles = makeStyles(theme => createStyles({
  app: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    userSelect: 'none'
  },
  backgroundAmber: {
    backgroundColor: amber.A400,
  },
  backgroundTeal: {
    backgroundColor: teal.A400,
  },
  backgroundRed: {
    backgroundColor: red.A400,
  },
  colorBlack: {
    color: '#000'
  },
  paperSummary: {
    padding: theme.spacing(1),
    minWidth: 160,
    minHeight: 80,
    justifyContent: 'space-evenly',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: theme.shadows[4]
  },
  fab: {
    position: 'fixed',
    bottom: `max(env(safe-area-inset-bottom), ${theme.spacing(3)}px)`,
    right: theme.spacing(3)
  },
  itemSummary: {
    position: 'sticky',
    top: `calc(env(safe-area-inset-top) + ${theme.spacing(1)}px)`,
    zIndex: theme.zIndex.appBar
  }
}))

const App = () => {
  const [casesByState, setCasesByState] = useState<CasesByState>(new Map())
  const [summary, setSummary] = useState<Summary | null>(null)

  const classes = useStyles()

  useEffect(() => firestore
    .collection("rkicases")
    .orderBy("state", "asc")
    .orderBy("timestamp", "asc")
    .onSnapshot(snapshot => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data() }) as RkiData)
      const states = new Set(docs.map(({ state }) => state))

      const newCases = new Map()
      states.forEach(state => newCases.set(state, docs.filter(doc => doc.state === state)))
      setCasesByState(newCases)
    })
    , [])

  useEffect(() => firestore
    .collection("rkicases")
    .orderBy("timestamp", "desc")
    .limit(16)
    .onSnapshot(snapshot => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data() }) as RkiData)

      setSummary({
        lastUpdate: createDateFromTimestamp((docs[0].timestamp)),
        cases: docs.reduce((acc, doc) => acc += doc.cases, 0),
        rate: docs.reduce((acc, doc) => acc += doc.rate, 0) / docs.length,
        deaths: docs.reduce((acc, doc) => acc += doc.deaths, 0)
      })
    }), [])

  const handleFabClick = () => window.scrollY === 0
    ? window.scrollTo({ top: document.body.clientHeight, behavior: 'smooth' })
    : window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className={classes.app}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} className={classes.itemSummary}>
              <Grid container spacing={2} justify="center">
                <Grid item >
                  <Paper className={classes.paperSummary}>
                    <Calendar />
                    {summary ? <Typography variant="h6"> {summary.lastUpdate.toLocaleDateString()}</Typography> : <Skeleton variant="text" width="70%" />}
                  </Paper>
                </Grid>

                <Grid item >
                  <Paper className={clsx(classes.paperSummary, classes.backgroundAmber)}>
                    <Sigma className={classes.colorBlack} />
                    {summary ? <Typography className={classes.colorBlack} variant="h6">{summary.cases}</Typography> : <Skeleton variant="text" width="70%" />}
                  </Paper>
                </Grid>

                <Grid item >
                  <Paper className={clsx(classes.paperSummary, classes.backgroundTeal)}>
                    <Percent className={classes.colorBlack} />
                    {summary ? <Typography className={classes.colorBlack} variant="h6">{summary.rate}</Typography> : <Skeleton variant="text" width="70%" />}
                  </Paper>
                </Grid>

                <Grid item >
                  <Paper className={clsx(classes.paperSummary, classes.backgroundRed)}>
                    <Skull />
                    {summary ? <Typography variant="h6">{summary.deaths}</Typography> : <Skeleton variant="text" width="70%" />}
                  </Paper>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider variant="middle" />
            </Grid>

            {[...casesByState.entries()].map(([state, data]) =>
              <Grid item xs={12} sm={6} lg={4} xl={3} key={state}>
                <Card elevation={4}>
                  <CardHeader title={state} />
                  <CardContent>
                    <ResponsiveContainer height='100%' width='100%' aspect={16 / 9}>
                      <LineChart data={data}>
                        <Tooltip content={({ payload, active }: TooltipProps) =>
                          <>
                            {active &&
                              <Card elevation={8}>
                                <CardHeader title={<>{createDateFromTimestamp(payload[0].payload.timestamp).toLocaleDateString()}</>} subheader={payload[0].payload.delta} />
                                <Divider variant="middle" />
                                <Box padding={2}>
                                  <Grid container wrap="nowrap" spacing={2}>
                                    <Grid item>
                                      <Chip className={clsx(classes.backgroundAmber, classes.colorBlack)} icon={<Sigma className={classes.colorBlack} />} label={payload[0].value} />
                                    </Grid>
                                    <Grid item>
                                      <Chip className={clsx(classes.backgroundTeal, classes.colorBlack)} icon={<Percent className={classes.colorBlack} />} label={payload[1].value} />
                                    </Grid>
                                    <Grid item>
                                      <Chip className={classes.backgroundRed} icon={<Skull />} label={payload[2].value} />
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Card>}
                          </>} />
                        <YAxis hide yAxisId="left" />
                        <YAxis hide yAxisId="right" orientation="right" />
                        <Line yAxisId="left" type="monotone" stroke={amber.A400} strokeWidth={3} dataKey="cases" />
                        <Line yAxisId="right" type="monotone" stroke={teal.A400} strokeWidth={3} dataKey="rate" />
                        <Line yAxisId="right" type="monotone" stroke={red.A400} strokeWidth={3} dataKey="deaths" />
                      </LineChart>
                    </ResponsiveContainer>

                  </CardContent>
                </Card>
              </Grid>)}

            {casesByState.size === 0 && new Array(16).fill(1).map((_dummy, index) =>
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card elevation={4}>
                  <CardHeader title={<Skeleton variant="text" width="40%" />} />
                  <CardContent>
                    <Skeleton variant="rect" width="100%" height={280} />
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider variant="middle" />
            </Grid>

            <Grid item xs={12}>
              <Grid container justify="center" spacing={2}>
                <Grid item>
                  <Link href="https://github.com/fabianhinz/rkicasesapi">Datenquelle</Link>
                </Grid>
                <Grid item>
                  <Link href="https://github.com/fabianhinz/rkicasesdashboard">Quellcode</Link>
                </Grid>
                <Grid item>
                  <Link href="https://www.flaticon.com/authors/freepik">Icons made by Freepik</Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>

        <Fab className={classes.fab} onClick={handleFabClick}>
          <UnfoldMoreHorizontal />
        </Fab>
      </ThemeProvider >
    </div>
  );
}

export default App;
