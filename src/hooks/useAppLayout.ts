import { useMediaQuery, useTheme } from '@material-ui/core'

interface AppLayout {
    isMobileLayout: boolean
    isDesktopLayout: boolean
}

const useAppLayout = (): AppLayout => {
    const theme = useTheme()
    const sm = useMediaQuery(theme.breakpoints.down('sm'))

    return { isMobileLayout: sm, isDesktopLayout: !sm }
}

export default useAppLayout
