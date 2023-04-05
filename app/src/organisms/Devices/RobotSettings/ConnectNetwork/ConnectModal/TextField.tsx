import * as React from 'react'

import {
  InputField,
  DeprecatedCheckboxField,
  INPUT_TYPE_TEXT,
  INPUT_TYPE_PASSWORD,
} from '@opentrons/components'

import { FormRow } from './FormRow'
import { useConnectFormField } from './form-state'
import { LABEL_SHOW_PASSWORD } from '../i18n'

export interface TextFieldProps {
  id: string
  name: string
  label: string
  isPassword: boolean
  className?: string
}

export const TextField = (props: TextFieldProps): JSX.Element => {
  const { id, name, label, isPassword, className } = props
  const { value, error, onChange, onBlur } = useConnectFormField(name)
  const [showPw, toggleShowPw] = React.useReducer(show => !show, false)
  const type = isPassword && !showPw ? INPUT_TYPE_PASSWORD : INPUT_TYPE_TEXT

  return (
    <FormRow label={label} labelFor={id}>
      <InputField
        {...{ className, type, id, name, value, error, onChange, onBlur }}
      />
      {isPassword && (
        <DeprecatedCheckboxField
          label={LABEL_SHOW_PASSWORD}
          value={showPw}
          onChange={toggleShowPw}
        />
      )}
    </FormRow>
  )
}
