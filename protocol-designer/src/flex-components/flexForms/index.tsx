import React from "react";
import cx from 'classnames'
import { OutlineButton, NewPrimaryBtn } from "@opentrons/components"
import flexStyles from '../FlexComponents.css'
import styles from './FlexForms.css'
import { ProtocolNameAndDescriptionComponent } from "../ProtocolNameAndDescription";
import { PipettesChooseFirstComponent } from "../PipettesChooseFirst";

export const FlexFormsComponent = () => {
    return <>
        <div className={cx(styles.main_container)}>
            <div className={cx(flexStyles.title_container)}>
                <p className={cx(flexStyles.title19_700)}>
                    Create new Opentrons Flex protocol
                </p>
                <OutlineButton className={cx(styles.cancel_button)}>
                    Cancel
                </OutlineButton>
            </div>
            <div className={styles.required_fields}>
                <p className={cx(flexStyles.text13_400)}>
                    *required fields
                </p>
            </div>
            <div className={cx(styles.flex_form_container)}>
                <ProtocolNameAndDescriptionComponent />
                <div className={flexStyles.line_separator_div}>
                </div>
            </div>
        </div>
    </>
}