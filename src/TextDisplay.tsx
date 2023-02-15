/*
Simple component for displaying text information in JSON Forms
*/

import { JsonSchema, UISchemaElement, rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Typography } from '@mui/material';

interface TextDisplayProps {
  data: any;
  path: string;
  schema: JsonSchema;
  uischema: UISchemaElement & { text: string };
  visible: boolean;
}

const TextDisplay = ({ data, path, schema, uischema, visible }: TextDisplayProps) => {
  return visible ? (
    <div>
      <Typography>{uischema.text}</Typography>
    </div>
  ) : null;
};

export default withJsonFormsControlProps(TextDisplay as any);

export const textTester = rankWith(
  4, //increase rank as needed
  uiTypeIs('Text')
);
