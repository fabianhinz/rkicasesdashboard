import 'firebase/firestore'

import firebase from 'firebase/app'

const firebaseConfig = {
    apiKey: 'AIzaSyCiBLIlEJpEjuLCaDCc7Uk_CLEpnQW2340',
    authDomain: 'rkicasesapi.firebaseapp.com',
    databaseURL: 'https://rkicasesapi.firebaseio.com',
    projectId: 'rkicasesapi',
    storageBucket: 'rkicasesapi.appspot.com',
    messagingSenderId: '481742378960',
    appId: '1:481742378960:web:b29de00a3d8ddd79ec4bd5',
}

firebase.initializeApp(firebaseConfig)
const firestore = firebase.firestore()
firestore.enablePersistence({ synchronizeTabs: true })

export { firestore }
