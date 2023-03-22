import React from "react";
import cx from 'classnames'
import flexStyles from '../FlexComponents.css'
import styles from './ProtocolNameAndDescription.css'
import { PrimaryButton } from "@opentrons/components";
import { PrimaryBtn } from "@opentrons/components";
import { NewPrimaryBtn } from "@opentrons/components";
import { NewAlertPrimaryBtn } from "@opentrons/components";

export const ProtocolNameAndDescriptionComponent = () => {
    return <>
        <div className={cx(styles.flex_component_container)}>
            <div>
                <p className={cx(flexStyles.title16_700)}>
                    Protocol Name and description
                </p>
            </div>
            <div>
                <p className={cx(flexStyles.text13_400)}>
                    Choose a name for your protocol.*
                </p>
            </div>
            <div>
                <p className={cx(flexStyles.text10_400)}>
                    Protocol Name
                </p>
            </div>
            <div className={styles.input_box_wrapper}>
                <input
                    className={flexStyles.input_box}
                    placeholder={''}
                />
            </div>
            <div>
                <p className={cx(flexStyles.i_text10_400)}>
                    supporting text about any error handling goes here.
                </p>
            </div>
            <div className={cx(flexStyles.margin_top27)}>
                <p className={cx(flexStyles.text13_400)}>
                    Add more information, if you like (you can change this later).
                </p>
            </div>
            <div>
                <p className={cx(flexStyles.text10_400)}>
                    Organization/Author
                </p>
            </div>
            <div className={styles.input_box_wrapper}>
                <input
                    className={flexStyles.input_box}
                    placeholder={''}
                />
            </div>
            <div>
                <p className={cx(flexStyles.i_text10_400)}>
                    supporting text about any error handling goes here.
                </p>
            </div>
            <div className={cx(flexStyles.margin_top12)}>
                <p className={cx(flexStyles.text10_400)}>
                    Description
                </p>
            </div>
            <div className={cx(styles.input_box_wrapper)}>
                <textarea className={cx(flexStyles.input_textarea)} />
            </div>
            <div>
                <p className={cx(flexStyles.i_text10_400)}>
                    supporting text about any error handling goes here.
                </p>
            </div>
        </div>
        <div className={flexStyles.line_separator_div}></div>
        <NewPrimaryBtn className={flexStyles.full_width}>
            <p>Next</p>
        </NewPrimaryBtn>
    </>
}