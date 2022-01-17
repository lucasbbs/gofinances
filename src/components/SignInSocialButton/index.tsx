import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';
interface Props extends TouchableOpacityProps {
  title: string;
  svg: React.FC<SvgProps>;
}

import { Button, ImageContainer, Text } from './styles';

const SignInSocialButton = ({ title, svg: Svg, ...rest }: Props) => {
  return (
    <Button {...rest}>
      <ImageContainer>
        <Svg />
      </ImageContainer>
      <Text>{title}</Text>
    </Button>
  );
};

export default SignInSocialButton;
