import { useMediaQuery, useTheme } from '@material-ui/core'
import React, { FC, useCallback, useContext, useEffect, useState } from 'react'

import db, { getOrThrow } from '../../services/db'

type Layout = 'desktop' | 'mobile'
type LayoutSetting = Layout | 'responsive'

interface LayoutContext {
    layout: Layout
    layoutSetting: LayoutSetting
    onLayoutSettingChange: (newLayoutSetting: LayoutSetting) => void
}

const Context = React.createContext<LayoutContext | null>(null)

export const useLayoutContext = () => useContext(Context) as LayoutContext

const LayoutProvider: FC = ({ children }) => {
    const [layout, setLayout] = useState<Layout>('desktop')
    const [layoutSetting, setLayoutSetting] = useState<LayoutSetting>('responsive')
    const theme = useTheme()
    const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'))

    useEffect(() => {
        getOrThrow<Layout>('layout').then(setLayoutSetting).catch(console.error)
    }, [])

    useEffect(() => {
        db.data.put(layoutSetting, 'layout')
    }, [layoutSetting])

    useEffect(() => {
        if (layoutSetting === 'responsive') {
            if (matchesMobile) setLayout('mobile')
            else setLayout('desktop')
        } else {
            setLayout(layoutSetting)
        }
    }, [layoutSetting, matchesMobile])

    const handleLayoutSettingChange = useCallback((newLayout: LayoutSetting | null) => {
        if (newLayout) setLayoutSetting(newLayout)
    }, [])

    return (
        <Context.Provider
            value={{ layout, layoutSetting, onLayoutSettingChange: handleLayoutSettingChange }}>
            {children}
        </Context.Provider>
    )
}

export default LayoutProvider
