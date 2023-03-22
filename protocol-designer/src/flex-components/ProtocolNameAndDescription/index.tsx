import React from "react";
import cx from 'classnames'
import flexStyles from '../FlexComponents.css'
import styles from './ProtocolNameAndDescription.css'
import { Box, PrimaryButton, PrimaryBtn, NewPrimaryBtn, NewAlertPrimaryBtn, FormGroup, InputField } from "@opentrons/components";
import { Formik } from "formik";

export const ProtocolNameAndDescriptionComponent = () => {

    const getInitialValues = {
        fields: {
            pndName: "test",
            pndOrgAuthor: "test2",
            pndDescription: "test3"
        }
    }
    return <div>
        <p className={flexStyles.pnd_header}>Protocol Name and description</p>
        <p>Choose a name for your protocol.*</p>

        <Formik
            enableReinitialize
            initialValues={getInitialValues}
            validateOnChange={false}
            onSubmit={(values, actions) => {
                console.log({ values, actions })
            }}
        >
            {
                (props: any) => (
                    <form onSubmit={props.handleSubmit}>
                        <div>
                            <div className={flexStyles.pnd_form}>
                                <FormGroup label="Protocol Name">
                                    <InputField
                                        autoFocus
                                        tabIndex={1}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.fields.pndName}
                                        name="fields.pndName"

                                    />
                                </FormGroup>
                                <small className={flexStyles.pnd_error_message}>
                                    supporting text about any error handling goes here.
                                </small>

                                <FormGroup label="Organization/Author">
                                    <InputField
                                        autoFocus
                                        tabIndex={1}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.fields.pndOrgAuthor}
                                        name="fields.pndOrgAuthor"

                                    />
                                </FormGroup>
                                <small className={flexStyles.pnd_error_message}>
                                    supporting text about any error handling goes here.
                                </small>

                                <FormGroup label="Description">
                                    <textarea
                                        rows={4}
                                        cols={50}
                                        autoFocus
                                        tabIndex={1}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.fields.pndDescription}
                                        name="fields.pndDescription"

                                    />
                                </FormGroup>
                                <small className={flexStyles.pnd_error_message}>
                                    supporting text about any error handling goes here.
                                </small>
                            </div>
                            <NewPrimaryBtn className={flexStyles.full_width} type="submit">Next</NewPrimaryBtn>
                        </div>
                    </form>
                )}
        </Formik>
    </div>
}