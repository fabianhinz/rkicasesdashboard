import 'typeface-roboto'
import 'typeface-ubuntu'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './Components/App'
import ConfigProvider from './Components/Provider/ConfigProvider'
import FirestoreProvider from './Components/Provider/FirestoreProvider'
import ThemeProvider from './Components/Provider/ThemeProvider'
import States from './Components/States/States'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <ThemeProvider>
        <ConfigProvider>
            <FirestoreProvider>
                <App />
            </FirestoreProvider>
            <States />
        </ConfigProvider>
    </ThemeProvider>,
    document.getElementById('root')
)

serviceWorker.register()
