import { IInputProps, Input as NBInput } from 'native-base';
import React, { forwardRef } from 'react';

export const Input = forwardRef<typeof NBInput, IInputProps>((props, ref) => (
  <NBInput _stack={{ style: {} }} ref={ref ?? undefined} {...props} />
));