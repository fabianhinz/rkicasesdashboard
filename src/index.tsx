import 'typeface-roboto'
import 'typeface-ubuntu'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './Components/App'
import Background from './Components/Background'
import Configprovider from './Components/Provider/Configprovider'
import Dataprovider from './Components/Provider/Dataprovider'
import Themeprovider from './Components/Provider/Themeprovider'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <Themeprovider>
        <Dataprovider>
            <Configprovider>
                <App />
                <Background />
            </Configprovider>
        </Dataprovider>
    </Themeprovider>,
    document.getElementById('root')
)

serviceWorker.register()
