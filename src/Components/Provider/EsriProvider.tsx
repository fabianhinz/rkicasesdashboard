import React, { createContext, FC, useCallback, useContext, useEffect } from 'react'

import { County, Feature } from '../../model/model'
import { EsriActions, EsriState, useEsriReducer } from '../../reducer/esriReducer'

type MostAffectedByState = Map<string, County[]>

interface Context {
    esriData: EsriState
    esriDispatch: React.Dispatch<EsriActions>
}

const Context = createContext<Context | null>(null)

export const useEsriContext = () => useContext(Context) as Context

const EsriProvider: FC = ({ children }) => {
    const [esriData, esriDispatch] = useEsriReducer()

    const fetchMostAffectedByState = useCallback(() => {
        fetch(
            'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=cases_per_100k,county,BL&returnGeometry=false&orderByFields=cases_per_100k%20DESC&outSR=4326&f=json'
        )
            .then(response => response.json())
            .then((esriData: { features: Feature[] }) => {
                const states = new Set(
                    Array.from(esriData.features.map(feature => feature.attributes.BL))
                )
                const mostAffectedByState = new Map<string, County[]>()

                states.forEach(state => {
                    mostAffectedByState.set(
                        state,
                        esriData.features
                            .filter(feature => feature.attributes.BL === state)
                            .map(({ attributes }) => ({
                                rate: Math.trunc(attributes.cases_per_100k),
                                county: attributes.county,
                            }))
                    )
                })
                esriDispatch({ type: 'mostAffectedByStateChange', mostAffectedByState })
            })
            // ToDo handle errors
            .catch(console.error)
            .finally(() => esriDispatch({ type: 'loadingChange', loading: false }))
    }, [esriDispatch])

    useEffect(() => {
        // ? give the ui some time to breath
        setTimeout(fetchMostAffectedByState, 2000)
    }, [fetchMostAffectedByState])

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
