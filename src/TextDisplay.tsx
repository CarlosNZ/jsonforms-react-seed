/*
Simple component for displaying text information in JSON Forms
*/

import {
  ControlElement,
  ControlProps,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Typography } from '@mui/material';

const TextDisplay = (props: ControlProps) => {
  const { uischema, visible } = props as ControlProps & {
    uischema: ControlElement & { text: string };
  };
  const { options } = uischema;
  return visible ? <Typography {...options}>{uischema.text}</Typography> : null;
};

export default withJsonFormsControlProps(TextDisplay as any);

export const textTester = rankWith(
  4, //increase rank as needed
  uiTypeIs('Text'),
);
