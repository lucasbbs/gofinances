import React from 'react'
import { View, Text } from 'react-native'

interface Props {
  title: string
}

export default function Welcome({ title }: Props) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  )
}
