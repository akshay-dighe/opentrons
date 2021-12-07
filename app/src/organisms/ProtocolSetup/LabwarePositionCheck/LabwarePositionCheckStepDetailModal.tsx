import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Btn,
  C_LIGHT_GRAY,
  C_MED_DARK_GRAY,
  C_NEAR_WHITE,
  Flex,
  FONT_WEIGHT_SEMIBOLD,
  Icon,
  JUSTIFY_CENTER,
  JUSTIFY_SPACE_BETWEEN,
  Modal,
  NewPrimaryBtn,
  SIZE_2,
  SIZE_4,
  SPACING_1,
  SPACING_2,
  SPACING_3,
  SPACING_4,
  SPACING_5,
  Text,
  TEXT_TRANSFORM_UPPERCASE,
} from '@opentrons/components'
import { Portal } from '../../../App/portal'
import styles from '../styles.css'

interface LabwarePositionCheckStepDetailModalProps {
  onCloseClick: () => unknown
}

export const LabwarePositionCheckStepDetailModal = (
  props: LabwarePositionCheckStepDetailModalProps
): JSX.Element => {
  const { t } = useTranslation(['labware_position_check', 'shared'])
  return (
    <Portal level="top">
      <Modal className={styles.modal} contentsClassName={styles.modal_contents}>
        <Flex flexDirection={'column'} margin={`${SPACING_1} ${SPACING_3}`}>
          <Flex justifyContent={JUSTIFY_SPACE_BETWEEN}>
            <Text
              as={'h3'}
              marginBottom={SPACING_3}
              textTransform={TEXT_TRANSFORM_UPPERCASE}
              fontWeight={FONT_WEIGHT_SEMIBOLD}
            >
              {t('labware_step_detail_modal_heading')}
            </Text>
            <Btn size={SIZE_2} onClick={props.onCloseClick}>
              <Icon name={'close'} color={C_MED_DARK_GRAY}></Icon>
            </Btn>
          </Flex>
          <Text
            as={'h4'}
            fontWeight={FONT_WEIGHT_SEMIBOLD}
            marginBottom={SPACING_3}
          >
            {t('labware_step_detail_modal_nozzle')}
          </Text>
          <Flex justifyContent={JUSTIFY_SPACE_BETWEEN}>
            <Box
              style={{
                backgroundImage: `url(../../../assets/images/lpc_modal_nozzle_1.jpg)`,
                backgroundSize: 'cover',
              }}
              marginRight={SPACING_1}
              width="50%"
            >
              <Text
                color={C_NEAR_WHITE}
                as={'h5'}
                fontWeight={FONT_WEIGHT_SEMIBOLD}
                marginTop={SPACING_2}
                marginLeft={SPACING_3}
                marginRight={SPACING_4}
              >
                {t('labware_step_detail_modal_nozzle_image_1_text')}
              </Text>
            </Box>
            <Box
              style={{
                backgroundImage: `url(../../../assets/images/lpc_modal_nozzle_not_centered_1.jpg)`,
                backgroundSize: 'cover',
              }}
              marginLeft={SPACING_1}
              width="50%"
            >
              <Box height="18rem">
                <Text
                  color={C_NEAR_WHITE}
                  as={'h5'}
                  fontWeight={FONT_WEIGHT_SEMIBOLD}
                  marginTop={SPACING_2}
                  marginLeft={SPACING_3}
                  marginRight={SPACING_4}
                >
                  {t('labware_step_detail_modal_nozzle_image_2_text')}
                </Text>
                <Text
                  color={'#ff5b5b'}
                  as={'h5'}
                  fontWeight={FONT_WEIGHT_SEMIBOLD}
                  marginTop={'4.5rem'}
                  marginLeft={'8.5rem'}
                >
                  {t('labware_step_detail_modal_nozzle_image_2_nozzle_text')}
                </Text>
              </Box>
            </Box>
          </Flex>
          <Text
            as={'h4'}
            fontWeight={FONT_WEIGHT_SEMIBOLD}
            marginTop={SPACING_3}
            marginBottom={SPACING_3}
          >
            {t('labware_step_detail_modal_nozzle_or_tip')}
          </Text>
          <Flex justifyContent={JUSTIFY_SPACE_BETWEEN}>
            <Box
              style={{
                backgroundImage: `url(../../../assets/images/lpc_modal_nozzle_2.jpg)`,
                backgroundSize: 'cover',
                flex: '1 1 31%',
              }}
              marginRight={SPACING_1}
            >
              <Text
                color={C_NEAR_WHITE}
                as={'h5'}
                fontWeight={FONT_WEIGHT_SEMIBOLD}
                marginTop={SPACING_2}
                marginLeft={SPACING_3}
                marginRight={SPACING_4}
              >
                {t('labware_step_detail_modal_nozzle_or_tip_image_1_text')}
              </Text>
            </Box>
            <Box
              style={{
                backgroundImage: `url(../../../assets/images/lpc_modal_nozzle_not_centered_2.jpg)`,
                backgroundSize: 'cover',
                flex: '1 1 31%',
              }}
              marginRight={SPACING_1}
              marginLeft={SPACING_1}
            >
              <Text
                color={C_NEAR_WHITE}
                as={'h5'}
                fontWeight={FONT_WEIGHT_SEMIBOLD}
                marginTop={SPACING_2}
                marginLeft={SPACING_3}
              >
                {t('labware_step_detail_modal_nozzle_or_tip_image_2_text')}
              </Text>
              <Text
                color={'#ff5b5b'}
                as={'h5'}
                fontWeight={FONT_WEIGHT_SEMIBOLD}
                marginTop={'1.7rem'}
                marginLeft={'6.7rem'}
              >
                {t(
                  'labware_step_detail_modal_nozzle_or_tip_image_2_nozzle_text'
                )}
              </Text>
            </Box>

            <Box
              style={{
                backgroundImage: `url(../../../assets/images/lpc_modal_nozzle_paper.jpg)`,
                backgroundSize: 'cover',
                flex: '1 1 31%',
              }}
              marginLeft={SPACING_1}
            >
              <Box backgroundColor={C_LIGHT_GRAY}>
                <Text
                  as={'h6'}
                  fontWeight={FONT_WEIGHT_SEMIBOLD}
                  color={'#4a4a4a'}
                  paddingTop={SPACING_1}
                  paddingLeft={SPACING_1}
                  marginTop={'11.18rem'}
                  marginLeft={SPACING_2}
                >
                  {t('labware_step_detail_modal_nozzle_or_tip_image_3_text')}
                </Text>
              </Box>
            </Box>
          </Flex>
          <Flex justifyContent={JUSTIFY_CENTER} marginTop={SPACING_5}>
            <NewPrimaryBtn onClick={props.onCloseClick} width={SIZE_4}>
              {t('shared:close')}
            </NewPrimaryBtn>
          </Flex>
        </Flex>
      </Modal>
    </Portal>
  )
}
