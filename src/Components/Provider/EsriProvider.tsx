import React, { createContext, FC, useCallback, useContext, useEffect } from 'react'

import { County, Feature } from '../../model/model'
import { AttributesKey, EsriActions, EsriState, useEsriReducer } from '../../reducer/esriReducer'

type MostAffectedByState = Map<string, County[]>

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
                                    value: Math.trunc(attributes[attributesKey]),
                                    county: attributes.county,
                                    lastUpdate: attributes.last_update,
                                }))
                        )
                    })
                    esriDispatch({ type: 'byStateChange', byState, attributesKey })
                })
                // ToDo handle errors
                .catch(console.error),
        [esriDispatch]
    )

    useEffect(() => {
        // ? give the ui some time to breath
        setTimeout(async () => {
            try {
                await Promise.all([
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
            } catch {
                // ? a request failed, just move on
            } finally {
                esriDispatch({ type: 'loadingChange', loading: false })
            }
        }, 2000)
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
