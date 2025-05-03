import { useState } from 'react'
import {
  ImageRequireSource,
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  View,
} from 'react-native'
import ImageModal from '@/dist'
import React from 'react'
import { style } from '@/src/style'
import { Image, ImageContentFit, ImageStyle } from 'expo-image'

export default function ExternalLibrary() {
  const [imageWidth, setImageWidth] = useState<number>(0)

  return (
    <SafeAreaView>
      <ScrollView>
        <View
          style={style.contentsContainer}
          onLayout={(event: LayoutChangeEvent) => {
            setImageWidth(event.nativeEvent.layout.width)
          }}
        >
          <Text style={style.heading}>Expo Image</Text>
          <ImageModal
            style={{
              width: imageWidth,
              height: 250,
            }}
            source={{
              uri: 'https://cdn.pixabay.com/photo/2018/01/11/09/52/three-3075752_960_720.jpg',
            }}
            renderImageComponent={({ source, resizeMode, style }) => (
              <Image
                style={style as StyleProp<ImageStyle>}
                source={source as ImageRequireSource}
                contentFit={resizeMode as ImageContentFit}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
