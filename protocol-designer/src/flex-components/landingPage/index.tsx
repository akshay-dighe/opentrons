import React from "react"
import cx from 'classnames'
import { Icon, OutlineButton } from "@opentrons/components"
import { Link } from "react-router-dom"

import styles from './LandingPage.css'

const navData: Props[] = [{
    innerText: "Create new Opentrons Flex protocol",
    link: "/flex-robot"
},
{
    innerText: "Create new OT-2 protocol",
    link: "/ot-2-robot"
}
]

export const LandingPageComponent = () => {
    return <>
        <div className={styles.landing_page_main}>
            <p className={styles.landing_page_headline}>Welcome to Protocol Designer</p>
            <div className={styles.ot_logo}>
                <Icon name={'ot-logo'} />
            </div>
            <ButtonGroup nav={navData} />
            <OutlineButton Component="label" className={cx(styles.upload_button)}>Import a protocol
                <input type="file" />
            </OutlineButton>
        </div>
    </>
}

export interface Props {
    innerText: string
    link: string
}

function ButtonGroup(props: any) {
    const { nav } = props
    return (
        nav ? nav.map((item: any, index: string) => {
            return <Link to={item.link} key={index}>
                <OutlineButton className={styles.button}>{item.innerText}</OutlineButton>
            </Link>
        }) : null
    )
}