import React, { createContext, FC, useCallback, useContext, useEffect } from 'react'

import { County, Feature } from '../../model/model'
import { AttributesKey, EsriActions, EsriState, useEsriReducer } from '../../reducer/esriReducer'

interface Context {
    esriData: EsriState
    esriDispatch: React.Dispatch<EsriActions>
}

const Context = createContext<Context | null>(null)

export const useEsriContext = () => useContext(Context) as Context

const EsriProvider: FC = ({ children }) => {
    const [esriData, esriDispatch] = useEsriReducer()

    const makeRequest = useCallback(
        (attributesKey: AttributesKey, url: string) =>
            fetch(url)
                .then(response => response.json())
                .then((esriData: { features: Feature[] }) => {
                    const states = new Set(
                        Array.from(esriData.features.map(feature => feature.attributes.BL))
                    )
                    const byState = new Map<string, County[]>()

                    states.forEach(state => {
                        byState.set(
                            state,
                            esriData.features
                                .filter(feature => feature.attributes.BL === state)
                                .map(({ attributes }) => ({
                                    value: Number(attributes[attributesKey].toFixed(1)),
                                    county: attributes.county,
                                    lastUpdate: attributes.last_update,
                                }))
                        )
                    })
                    esriDispatch({ type: 'byStateChange', byState, attributesKey })
                })
                .catch(e => {
                    throw new Error(`${attributesKey} ${e}`)
                }),
        [esriDispatch]
    )

    useEffect(() => {
        Promise.all([
            makeRequest(
                'cases7_per_100k',
                'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=last_update,cases7_per_100k,county,BL&returnGeometry=false&orderByFields=cases7_per_100k%20DESC&outSR=4326&f=json'
            ),
            makeRequest(
                'cases_per_100k',
                'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=last_update,cases_per_100k,county,BL&returnGeometry=false&orderByFields=cases_per_100k%20DESC&outSR=4326&f=json'
            ),
            makeRequest(
                'cases',
                'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=last_update,county,BL,cases&returnGeometry=false&orderByFields=cases DESC&outSR=4326&f=json'
            ),
            makeRequest(
                'deaths',
                'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=last_update,county,BL,deaths&returnGeometry=false&orderByFields=deaths DESC&outSR=4326&f=json'
            ),
        ])
            .catch(e => esriDispatch({ type: 'errorMsgChange', errorMsg: e.toString() }))
            .finally(() => esriDispatch({ type: 'loadingChange', loading: false }))
    }, [esriDispatch, makeRequest])

    return (
        <Context.Provider
            value={{
                esriData,
                esriDispatch,
            }}>
            {children}
        </Context.Provider>
    )
}

export default EsriProvider
