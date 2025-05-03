import type { ReactNode } from 'react'

import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'

const styles = StyleSheet.create({
  clippingArea: {
    position: 'absolute',
  },
})

interface Props {
  readonly animatedFrame: SharedValue<number>
  readonly parentLayout?: {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
  }
  readonly isTranslucent: boolean
  readonly renderToHardwareTextureAndroid: boolean
  readonly children: ReactNode
}

const DisplayImageArea = ({
  animatedFrame,
  parentLayout,
  isTranslucent,
  renderToHardwareTextureAndroid,
  children,
}: Props) => {
  // When parentLayout is not passed in the props,
  // clipping is not needed, so clipping area should be full screen.
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

  // On Android, the status bar height should be added to the top position of the clipping area.
  const statusBarHeight =
    isTranslucent && Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0

  const animatedStyle = useAnimatedStyle(() => ({
    left: interpolate(animatedFrame.value, [0, 1], [parentLayout?.x ?? 0, 0]),
    top: interpolate(animatedFrame.value, [0, 1], [(parentLayout?.y ?? 0) + statusBarHeight, 0]),
    width: interpolate(
      animatedFrame.value,
      [0, 1],
      [parentLayout?.width ?? windowWidth, windowWidth],
    ),
    height: interpolate(
      animatedFrame.value,
      [0, 1],
      [parentLayout?.height ?? windowHeight, windowHeight],
    ),
  }))
  return (
    <Animated.View
      style={[styles.clippingArea, animatedStyle]}
      renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
    >
      {children}
    </Animated.View>
  )
}

export { DisplayImageArea }
