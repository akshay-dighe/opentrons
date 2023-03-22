import React from "react";
import cx from 'classnames';
import flexStyles from '../FlexComponents.css';
import styles from './PipettesChooseFirst.css';
import './PipettesChooseFirst.css';
import { RadioGroup, CheckboxField } from "@opentrons/components";

export const PipettesChooseFirstComponent = () => {
    return <>
        <div className={cx(flexStyles.heading_container)}>
            <p className={cx(flexStyles.title16_700)}>
                Protocol name/description
            </p>
            <a href="#" className={cx(flexStyles.text10_400)}>Edit</a>
        </div>
        <div>
            <p className={cx(flexStyles.text14_400)}>
                Name
            </p>
        </div>
        <div>
            <p className={cx(flexStyles.text14_400)}>
                Author
            </p>
        </div>
        <div>
            <p className={cx(flexStyles.text14_400)}>
                Description
            </p>
        </div>
        <div className={flexStyles.line_separator_div}>
        </div>
        <div>
            <p className={cx(flexStyles.title16_700)}>
                Pipettes
            </p>
        </div>
        <div>
            <p className={cx(flexStyles.title14_700)}>
                Choose first pipette
            </p>
        </div>
        <div>
            <p className={cx(flexStyles.text10_400)}>
                Note: 96-channel pipettes take up both mounts and requires a tiprack adapter.
            </p>
        </div>
        <div>
            <RadioGroup
                options={[
                    {
                        name: 'Low volume single-channel',
                        value: 'Low volume single-channel',
                    },
                    {
                        name: 'High-volume single-channel',
                        value: 'High-volume single-channel',
                    },
                    {
                        name: 'Low-volume 8-channel',
                        value: 'Low-volume 8-channel',
                    },
                    {
                        name: 'High-volume 8-channel',
                        value: 'High-volume 8-channel',
                    },
                    {
                        name: '96-channel',
                        value: '96-channel',
                    },
                ]}
            />
        </div>
        <div className={flexStyles.line_separator_div} style={{ 'width': '362px', 'border-top': '1px solid #16212D' }}>
        </div>
        <div>
            <RadioGroup
                options={[
                    {
                        name: 'Left mount',
                        value: 'Left mount',

                    },
                    {
                        name: 'Right mount',
                        value: 'Right mount',
                    },
                ]}
            />
        </div>
        <div className={flexStyles.line_separator_div}>
        </div>
        <div>
            <p className={cx(flexStyles.title14_700)}>
                Choose at least 1 tiprack for this pipette
            </p>
        </div>
        <div>
            <CheckboxField
                label={'tiprack a'}
                name={''}
                value={'1'}
            />
            <CheckboxField
                label={'tiprack b'}
                name={''}
                value={''}
            />
            <CheckboxField
                label={'tiprack c'}
                name={''}
                value={''}
            />
            <CheckboxField
                label={'tiprack d'}
                name={''}
                value={''}
            />
            <CheckboxField
                label={'tiprack e'}
                name={''}
                value={''}
            />
            <CheckboxField
                label={'Custom tiprack...'}
                name={''}
                value={''}
            />
        </div>
    </>
}