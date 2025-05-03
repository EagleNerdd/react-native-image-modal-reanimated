import type { ReactNode } from 'react'

import { StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

import type { SharedValue } from 'react-native-reanimated'

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
})

interface Props {
  readonly renderToHardwareTextureAndroid: boolean
  readonly animatedOpacity: SharedValue<number>
  renderFooter?(close: () => void): ReactNode
  onClose(): void
}

const Footer = ({
  renderToHardwareTextureAndroid,
  animatedOpacity,
  renderFooter,
  onClose,
}: Props) => {
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
  }))
  if (typeof renderFooter !== 'function') {
    return
  }

  return (
    <Animated.View
      renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
      style={[styles['footer'], animatedStyles]}
    >
      {renderFooter(onClose)}
    </Animated.View>
  )
}

export { Footer }
