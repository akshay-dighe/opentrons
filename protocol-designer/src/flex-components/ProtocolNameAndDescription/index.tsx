import React, { useState } from "react";
import cx from 'classnames'
import flexStyles from '../FlexComponents.css'
import formStyles from '../../components/forms/forms.css'
import styles from './ProtocolNameAndDescription.css'
import { Box, PrimaryButton, PrimaryBtn, NewPrimaryBtn, NewAlertPrimaryBtn, FormGroup, InputField, Flex, DIRECTION_COLUMN } from "@opentrons/components";
import { Formik } from "formik";
import { RoundTab } from '../../../../app/src/molecules/RoundTab'
import { StyledText } from '../../../../app/src/atoms/text'
import { COLORS } from "@opentrons/components";
import { BORDERS } from "@opentrons/components";
import { SPACING } from "@opentrons/components";
import { TYPOGRAPHY } from "@opentrons/components";


const RoundTabNavPills = (props: any) => {
    const { setPills, currentTab } = props
    const navPillsName = [{
        name: 'Protocol Name and description',
        id: 1
    }, {
        name: 'Pipette Selection',
        id: 2
    }, {
        name: 'Module Selection',
        id: 3
    }]

    return (
        <>
            {
                navPillsName.map(({ name, id }, index) => {
                    return <RoundTab
                        key={index}
                        isCurrent={currentTab === id}
                        onClick={() => setPills(id)}
                    >
                        <StyledText as="h1">{name}</StyledText>
                    </RoundTab>
                })
            }
        </>
    )
}

const selectComponent = (selectedId: Number) => {
    switch (selectedId) {
        case 1:
            return <StepOneComponent />
        case 2:
            return <SecondComponent />
        case 3:
            return <ThirdComponent />
        default:
            return null;
    }
}

export const ProtocolNameAndDescriptionComponent = () => {
    const [selectedNavPill, setNavPill] = useState<number>(1)

    const handleNext = (selectedNavPill: number) => {
        const setNumber = (selectedNavPill > 0 && selectedNavPill < 3) ? selectedNavPill + 1 : selectedNavPill
        setNavPill(setNumber)
    }
    const handlePrev = (selectedNavPill: number) => {
        const setNumber = (selectedNavPill > 1 && selectedNavPill <= 3) ? selectedNavPill - 1 : selectedNavPill
        setNavPill(setNumber)
    }

    const nextButton = selectedNavPill === 3 ? "Go to Liquid Page" : "Next"
    return (
        <Flex flexDirection={DIRECTION_COLUMN}>
            <Flex>
                <RoundTabNavPills setPills={setNavPill} currentTab={selectedNavPill} />
            </Flex>
            <Box
                backgroundColor={COLORS.white}
                border={BORDERS.lineBorder}
                // remove left upper corner border radius when first tab is active
                borderRadius={selectedNavPill === 1 ? '0' : BORDERS.radiusSoftCorners}
                padding={SPACING.spacing4}
            >
                {selectComponent(selectedNavPill)}
                {
                    selectedNavPill !== 1 && <NewPrimaryBtn type="submit" onClick={() => handlePrev(selectedNavPill)}>Prev</NewPrimaryBtn>
                }
                <NewPrimaryBtn type="submit" onClick={() => handleNext(selectedNavPill)}>{nextButton}</NewPrimaryBtn>
            </Box>
        </Flex>

    )

    //  FORMIK WORKING CODE 

    // 
    // return <div>
    //     <p className={flexStyles.pnd_header}>Protocol Name and description</p>
    //     <p>Choose a name for your protocol.*</p>

    //     <Formik
    //         enableReinitialize
    //         initialValues={getInitialValues}
    //         validateOnChange={false}
    //         onSubmit={(values, actions) => {
    //             console.log({ values, actions })
    //         }}
    //     >
    //         {
    //             (props: any) => (
    //                 <form onSubmit={props.handleSubmit}>
    //                     <div>
    //                         <div className={flexStyles.pnd_form}>
    //                             <FormGroup label="Protocol Name">
    //                                 <InputField
    //                                     autoFocus
    //                                     tabIndex={1}
    //                                     onChange={props.handleChange}
    //                                     onBlur={props.handleBlur}
    //                                     value={props.values.fields.pndName}
    //                                     name="fields.pndName"

    //                                 />
    //                             </FormGroup>
    //                             <small className={flexStyles.pnd_error_message}>
    //                                 supporting text about any error handling goes here.
    //                             </small>

    //                             <FormGroup label="Organization/Author">
    //                                 <InputField
    //                                     autoFocus
    //                                     tabIndex={1}
    //                                     onChange={props.handleChange}
    //                                     onBlur={props.handleBlur}
    //                                     value={props.values.fields.pndOrgAuthor}
    //                                     name="fields.pndOrgAuthor"

    //                                 />
    //                             </FormGroup>
    //                             <small className={flexStyles.pnd_error_message}>
    //                                 supporting text about any error handling goes here.
    //                             </small>

    //                             <FormGroup label="Description">
    //                                 <textarea
    //                                     rows={4}
    //                                     cols={50}
    //                                     autoFocus
    //                                     tabIndex={1}
    //                                     onChange={props.handleChange}
    //                                     onBlur={props.handleBlur}
    //                                     value={props.values.fields.pndDescription}
    //                                     name="fields.pndDescription"

    //                                 />
    //                             </FormGroup>
    //                             <small className={flexStyles.pnd_error_message}>
    //                                 supporting text about any error handling goes here.
    //                             </small>
    //                         </div>
    //                         <NewPrimaryBtn className={flexStyles.full_width} type="submit">Next</NewPrimaryBtn>
    //                     </div>
    //                 </form>
    //             )}
    //     </Formik>
    // </div>
}




const StepOneComponent = () => {
    return <div className={flexStyles.pnd_form}>
            <FormGroup label="Protocol Name">
                <InputField
                    autoFocus
                    tabIndex={1}
                    type="text"
                    // onChange={props.handleChange}
                    // onBlur={props.handleBlur}
                    // value={props.values.fields.pndName}
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
                    type="text"
                    // onChange={props.handleChange}
                    // onBlur={props.handleBlur}
                    // value={props.values.fields.pndOrgAuthor}
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

                    // onChange={props.handleChange}
                    // onBlur={props.handleBlur}
                    // value={props.values.fields.pndDescription}
                    name="fields.pndDescription"

                />
            </FormGroup>
            <small className={flexStyles.pnd_error_message}>
                supporting text about any error handling goes here.
            </small>
        </div>
}


const SecondComponent = () => {
    return <h1>Second Component</h1>
}


const ThirdComponent = () => {
    return <h1>Third Component</h1>
}