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
}

const TextDisplay = ({ data, path, schema, uischema }: TextDisplayProps) => {
  return (
    <div>
      <Typography>{uischema.text}</Typography>
    </div>
  );
};

export default withJsonFormsControlProps(TextDisplay as any);

export const textTester = rankWith(
  4, //increase rank as needed
  uiTypeIs('Text')
);
