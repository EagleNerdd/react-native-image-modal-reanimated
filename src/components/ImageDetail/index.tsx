import type { ReactNode } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import { Dimensions, Modal, View } from 'react-native'
import { useSharedValue, withTiming } from 'react-native-reanimated'

import { Background, DisplayImageArea, Footer, Header, ImageArea } from './components'

import type { OnMove, OnTap, RenderImageComponentParams } from '../../types'
import type { ImageResizeMode, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native'

const INITIAL_SCALE = 1

interface ImageDetail {
  close(): void
}

interface Props {
  readonly renderToHardwareTextureAndroid: boolean
  readonly isTranslucent?: boolean
  readonly isOpen: boolean
  readonly origin: {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
  }
  readonly source: ImageSourcePropType
  readonly resizeMode?: ImageResizeMode
  readonly backgroundColor?: string
  readonly swipeToDismiss: boolean
  readonly hideCloseButton?: boolean
  readonly imageStyle?: StyleProp<ImageStyle>
  readonly parentLayout?: {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
  }
  readonly animationDuration: number
  renderHeader?(close: () => void): ReactNode
  renderFooter?(close: () => void): ReactNode
  renderImageComponent?(params: RenderImageComponentParams): ReactNode
  onTap?(eventParams: OnTap): void
  onDoubleTap?(): void
  onLongPress?(): void
  didOpen?(): void
  onMove?(position: OnMove): void
  responderRelease?(vx?: number, scale?: number): void
  willClose?(): void
  onClose(): void
}

const ImageDetailComponent = forwardRef<ImageDetail, Props>(function ImageDetailComponent(
  {
    renderToHardwareTextureAndroid,
    isTranslucent = false,
    isOpen,
    origin,
    source,
    resizeMode = 'contain',
    backgroundColor = '#000000',
    swipeToDismiss,
    hideCloseButton = false,
    imageStyle,
    parentLayout,
    animationDuration,
    renderHeader,
    renderFooter,
    renderImageComponent,
    onTap,
    onDoubleTap,
    onLongPress,
    didOpen,
    onMove,
    responderRelease,
    willClose,
    onClose,
  }: Props,
  ref,
) {
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window')
  const originImagePosition = {
    x: origin.x - (parentLayout?.x ?? 0) / 2,
    y: origin.y - (parentLayout?.y ?? 0),
  }
  const { width: originImageWidth, height: originImageHeight } = origin

  const animatedScale = useSharedValue(INITIAL_SCALE)
  const animatedPosition = useSharedValue({ x: 0, y: 0 })
  const animatedFrame = useSharedValue(0)
  const animatedOpacity = useSharedValue(0)
  const animatedImagePosition = useSharedValue(originImagePosition)
  const animatedImageWidth = useSharedValue(originImageWidth)
  const animatedImageHeight = useSharedValue(originImageHeight)

  const isAnimated = useRef(true)

  const handleClose = (): void => {
    isAnimated.current = true
    willClose?.()

    setTimeout(() => {
      animatedOpacity.value = withTiming(0, { duration: animationDuration })
      animatedFrame.value = withTiming(0, { duration: animationDuration })
      animatedScale.value = withTiming(INITIAL_SCALE, { duration: animationDuration })
      animatedPosition.value = withTiming({ x: 0, y: 0 }, { duration: animationDuration })
      animatedImagePosition.value = withTiming(originImagePosition, {
        duration: animationDuration * 2,
      })
      animatedImageWidth.value = withTiming(originImageWidth, { duration: animationDuration * 2 })
      animatedImageHeight.value = withTiming(originImageHeight, { duration: animationDuration * 2 })

      onClose()
      isAnimated.current = false
    })
  }

  const handleOpen = () => {
    isAnimated.current = true

    setTimeout(() => {
      animatedOpacity.value = withTiming(1, { duration: animationDuration })
      animatedFrame.value = withTiming(1, { duration: animationDuration })
      animatedImagePosition.value = withTiming(
        {
          x: 0,
          y: 0,
        },
        {
          duration: animationDuration * 2,
        },
      )
      animatedImageWidth.value = withTiming(windowWidth, { duration: animationDuration * 2 })
      animatedImageHeight.value = withTiming(windowHeight, { duration: animationDuration * 2 })

      isAnimated.current = false
      if (isOpen) {
        didOpen?.()
      }
    })
  }

  useEffect(() => {
    handleOpen()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    animatedOpacity,
    animatedImagePosition,
    animatedImageWidth,
    animatedImageHeight,
    animatedFrame,
  ])

  useImperativeHandle(ref, () => ({
    close: handleClose,
  }))

  return (
    <View>
      <Modal
        hardwareAccelerated
        visible={isOpen}
        transparent
        statusBarTranslucent={isTranslucent}
        onRequestClose={handleClose}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
      >
        <Background
          animatedOpacity={animatedOpacity}
          backgroundColor={backgroundColor}
          renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
        />
        <DisplayImageArea
          animatedFrame={animatedFrame}
          parentLayout={parentLayout}
          isTranslucent={isTranslucent}
          renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
        >
          <ImageArea
            renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
            isAnimated={isAnimated}
            animatedOpacity={animatedOpacity}
            animatedScale={animatedScale}
            animatedPosition={animatedPosition}
            animatedImagePosition={animatedImagePosition}
            animatedImageWidth={animatedImageWidth}
            animatedImageHeight={animatedImageHeight}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            swipeToDismiss={swipeToDismiss}
            source={source}
            resizeMode={resizeMode}
            imageStyle={imageStyle}
            animationDuration={animationDuration}
            isModalOpen={isOpen}
            renderImageComponent={renderImageComponent}
            onClose={handleClose}
            onMove={onMove}
            onTap={onTap}
            onDoubleTap={onDoubleTap}
            onLongPress={onLongPress}
            responderRelease={responderRelease}
          />
        </DisplayImageArea>
        <Header
          isTranslucent={isTranslucent}
          hideCloseButton={hideCloseButton}
          renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
          animatedOpacity={animatedOpacity}
          renderHeader={renderHeader}
          onClose={handleClose}
        />
        <Footer
          renderToHardwareTextureAndroid={renderToHardwareTextureAndroid}
          animatedOpacity={animatedOpacity}
          renderFooter={renderFooter}
          onClose={handleClose}
        />
      </Modal>
    </View>
  )
})

export { ImageDetailComponent }
export type { ImageDetail }
