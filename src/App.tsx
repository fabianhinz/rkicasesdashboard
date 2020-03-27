import React, { useEffect, useState } from 'react';
import 'firebase/firestore'
import firebase from 'firebase/app'
import { LineChart, ResponsiveContainer, Line, Tooltip, YAxis } from 'recharts'
import { Grid, CssBaseline, Box, Card, CardHeader, CardContent, ThemeProvider, createMuiTheme, Chip, Divider, Link, Container, makeStyles, createStyles } from '@material-ui/core'
import { red, teal, amber } from '@material-ui/core/colors';
import { Skull, Sigma, Percent } from 'mdi-material-ui'
import Skeleton from '@material-ui/lab/Skeleton';

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

type State = string
type CasesMap = Map<State, Omit<RkiData, "state">[]>

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
      title: {
        fontFamily: 'Ubuntu'
      }
    },
    MuiLink: {
      root: {
        fontSize: '1rem',
        fontFamily: 'Ubuntu'
      }
    }
  }
})

const useStyles = makeStyles(theme => createStyles({
  app: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    userSelect: 'none'
  },
  casesChip: {
    backgroundColor: amber.A400,
    color: '#000'
  },
  rateChip: {
    backgroundColor: teal.A400,
    color: '#000'
  },
  deathsChip: {
    backgroundColor: red.A400,
  },
  chipIcon: {
    color: '#000'
  }
}))

const App = () => {
  const [cases, setCases] = useState<CasesMap>(new Map())

  const classes = useStyles()

  useEffect(() => firestore
    .collection("rkicases")
    .orderBy("timestamp", "asc")
    .orderBy("cases", "desc")
    .onSnapshot(rkicases => {
      const docs = rkicases.docs.map(doc => ({ ...doc.data() }) as RkiData)
      const states = new Set(docs.map(({ state }) => state))

      const newCases = new Map()
      states.forEach(state => newCases.set(state, docs.filter(doc => doc.state === state)))
      setCases(newCases)
    })
    , [])

  return (
    <div className={classes.app}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {[...cases.entries()].map(([state, data]) =>
              <Grid item xs={12} sm={6} lg={4} key={state}>
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
                                      <Chip className={classes.casesChip} icon={<Sigma className={classes.chipIcon} />} label={payload[0].value} />
                                    </Grid>
                                    <Grid item>
                                      <Chip className={classes.rateChip} icon={<Percent className={classes.chipIcon} />} label={payload[1].value} />
                                    </Grid>
                                    <Grid item>
                                      <Chip className={classes.deathsChip} icon={<Skull />} label={payload[2].value} />
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
            {cases.size === 0 && new Array(16).fill(1).map((_dummy, index) =>
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
              <Grid container justify="flex-end" spacing={2}>
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
      </ThemeProvider >
    </div>
  );
}

export default App;
