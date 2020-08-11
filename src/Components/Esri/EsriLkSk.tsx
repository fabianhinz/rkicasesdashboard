import { Button } from '@material-ui/core'
import { amber, cyan, red } from '@material-ui/core/colors'
import { Close } from 'mdi-material-ui'
import React, { useState } from 'react'

import { County } from '../../model/model'
import { Drawer, DrawerAction, DrawerContent, DrawerHeader } from '../Shared/Drawer'
import EsriLkSkList from './EsriLkSkList'
import EsriLkSkTabs from './EsriLkSkTabs'

export type CountyWithName = County & { name?: string }

interface Props {
    open: boolean
    onClose: () => void
}

const EsriLkSk = ({ open, onClose }: Props) => {
    const [tabIndex, setTabIndex] = useState(2)

    const tabsindicatorColor =
        tabIndex === 0 ? amber.A400 : tabIndex === 1 || tabIndex === 2 ? cyan.A400 : red.A400

    return (
        <Drawer open={open} onClose={onClose}>
            <DrawerHeader
                title={
                    <EsriLkSkTabs
                        tabIndex={tabIndex}
                        onTabIndexChange={setTabIndex}
                        tabsindicatorColor={tabsindicatorColor}
                    />
                }
            />
            <DrawerContent>
                <EsriLkSkList tabIndex={tabIndex} tabsindicatorColor={tabsindicatorColor} />
            </DrawerContent>
            <DrawerAction>
                <Button fullWidth onClick={onClose} startIcon={<Close />}>
                    schließen
                </Button>
            </DrawerAction>
        </Drawer>
    )
}

export default EsriLkSk
