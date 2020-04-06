import 'typeface-roboto'
import 'typeface-ubuntu'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './Components/App'
import Configprovider from './Components/Provider/Configprovider'
import Dataprovider from './Components/Provider/Dataprovider'
import Themeprovider from './Components/Provider/Themeprovider'
import States from './Components/States/States'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <Themeprovider>
        <Configprovider>
            <Dataprovider>
                <App />
                <States />
            </Dataprovider>
        </Configprovider>
    </Themeprovider>,
    document.getElementById('root')
)

serviceWorker.register()
