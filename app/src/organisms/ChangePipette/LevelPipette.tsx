import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { css } from 'styled-components'

import {
  DIRECTION_COLUMN,
  DIRECTION_ROW,
  Flex,
  JUSTIFY_FLEX_END,
  JUSTIFY_SPACE_BETWEEN,
  SPACING,
  TYPOGRAPHY,
  PrimaryButton,
} from '@opentrons/components'
import { StyledText } from '../../atoms/text'

import type { Mount } from '../../redux/pipettes/types'

interface LevelPipetteProps {
  mount: Mount
  pipetteModelName: string
  confirm: () => void
}

function LevelingVideo(props: {
  pipetteName: string
  mount: Mount
}): JSX.Element {
  const { pipetteName, mount } = props
  return (
    <video
      css={css`
        width: 275px;
        max-height: 270px;
        margin-top: ${SPACING.spacing4};
        margin-left: ${SPACING.spacing4};
      `}
      autoPlay={true}
      loop={true}
      controls={true}
    >
      <source
        src={require(`../../assets/videos/pip-leveling/${pipetteName}-${mount}.webm`)}
      />
    </video>
  )
}

export function LevelPipette(props: LevelPipetteProps): JSX.Element {
  const { mount, pipetteModelName, confirm } = props

  const { t } = useTranslation('change_pipette')

  return (
    <>
      <Flex
        flexDirection={DIRECTION_COLUMN}
        paddingX={SPACING.spacing6}
        paddingTop={SPACING.spacing6}
        height="100%"
      >
        <Flex
          flexDirection={DIRECTION_ROW}
          justifyContent={JUSTIFY_SPACE_BETWEEN}
          marginBottom={SPACING.spacingXXL}
        >
          <Flex flexDirection={DIRECTION_COLUMN}>
            <Trans
              t={t}
              i18nKey={'level_the_pipette'}
              values={{
                slot: mount === 'left' ? '3' : '1',
                side: pipetteModelName === 'p20_mutli_gen2' ? 'short' : 'tall',
                direction: mount,
              }}
              components={{
                strong: (
                  <strong
                    style={{ fontWeight: TYPOGRAPHY.fontWeightSemiBold }}
                  />
                ),
                h1: (
                  <StyledText
                    css={TYPOGRAPHY.h1Default}
                    marginBottom={SPACING.spacing4}
                  />
                ),
                block: (
                  <StyledText
                    css={css`
                      display: list-item;
                    `}
                    marginLeft={SPACING.spacing6}
                    as="p"
                  />
                ),
              }}
            />
          </Flex>
          <LevelingVideo pipetteName={pipetteModelName} mount={mount} />
        </Flex>
      </Flex>
      <Flex justifyContent={JUSTIFY_FLEX_END} margin={SPACING.spacing6}>
        <PrimaryButton onClick={confirm}>{t('confirm_level')}</PrimaryButton>
      </Flex>
    </>
  )
}
