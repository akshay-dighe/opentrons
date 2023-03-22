import React from "react";
import cx from 'classnames'
import flexStyles from '../FlexComponents.css'
import styles from './ProtocolNameAndDescription.css'

export const ProtocolNameAndDescriptionComponent = () => {
    return <>
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
    </>
}