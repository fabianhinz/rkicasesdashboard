import 'typeface-roboto'
import 'typeface-ubuntu'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './Components/App'
import Themeprovider from './Components/Provider/Themeprovider'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <Themeprovider>
        <App />
    </Themeprovider>,
    document.getElementById('root')
)

serviceWorker.register()
