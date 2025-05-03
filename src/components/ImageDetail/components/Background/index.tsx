import { StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

import type { ColorValue } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
})

interface Props {
  readonly animatedOpacity: SharedValue<number>
  readonly backgroundColor: ColorValue
  readonly renderToHardwareTextureAndroid: boolean
}

const Background = ({
  animatedOpacity,
  backgroundColor,
  renderToHardwareTextureAndroid,
}: Props) => {
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
  }))
  return (
    <Animated.View
      renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
      style={[styles.background, { backgroundColor }, animatedStyles]}
    />
  )
}

export { Background }
