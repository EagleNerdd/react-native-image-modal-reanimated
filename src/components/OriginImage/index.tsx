import type { ReactNode } from 'react'

import { Image, TouchableOpacity } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

import type { RenderImageComponentParams } from '../../types'
import type { ImageResizeMode, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

interface Props {
  readonly source: ImageSourcePropType
  readonly resizeMode: ImageResizeMode
  readonly imageOpacity: SharedValue<number>
  readonly renderToHardwareTextureAndroid: boolean
  readonly disabled: boolean
  readonly style?: StyleProp<ImageStyle>
  readonly isModalOpen: boolean
  onDialogOpen(): void
  onLongPressOriginImage?(): void
  renderImageComponent?(params: RenderImageComponentParams): ReactNode
}

const OriginImage = ({
  source,
  resizeMode,
  imageOpacity,
  renderToHardwareTextureAndroid,
  disabled,
  style,
  isModalOpen,
  onDialogOpen,
  onLongPressOriginImage,
  renderImageComponent,
}: Props) => {
  const handleOpen = (): void => {
    if (disabled) {
      return
    }
    onDialogOpen()
  }
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
  }))
  return (
    <Animated.View
      renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
      style={animatedStyles}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{ alignSelf: 'baseline' }}
        onPress={handleOpen}
        onLongPress={onLongPressOriginImage}
      >
        {typeof renderImageComponent === 'function' ? (
          renderImageComponent({
            source,
            style,
            resizeMode,
            isModalOpen,
          })
        ) : (
          <Image source={source} style={style} resizeMode={resizeMode} />
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

export { OriginImage }
