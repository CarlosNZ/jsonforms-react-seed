/*
Autocomplete component for JSON Forms
*/

import { ControlProps, rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Autocomplete as MuiAutocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface AutocompleteOptions extends ControlProps {
  searchTextPath: string;
  options?: string[];
  noResultsText?: string;
  minChars?: number;
}

const Autocomplete = (props: AutocompleteOptions) => {
  const { uischema, visible, handleChange, path, label, data } = props;
  const {
    searchTextPath,
    options,
    noResultsText,
    minChars = 3,
  } = uischema?.options ?? {};
  console.log('DATA', data);
  const [searchText, setSearchText] = useState('');
  const [displayOptions, setDisplayOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const debounce = useDebouncedCallback(value => {
    if (value.length >= minChars) {
      handleChange(searchTextPath, value);
      handleChange(path, undefined);
      setLoading(true);
    }
    console.log('VALUE', value);
  }, 1000);

  useEffect(() => {
    setLoading(false);
    if (options.length > 0) setDisplayOptions(options);
  }, [options]);

  console.log('loading', loading);

  const handleInput = (text: string) => {
    console.log('TExt', text);
    setSearchText(text);
    setDisplayOptions([]);
    if (text.length >= minChars) {
      setLoading(true);
    }
    debounce(text);
  };

  console.log('displayOptions', displayOptions);

  return visible ? (
    <MuiAutocomplete
      options={displayOptions}
      // options={[{ label: 'Text value', value: 1, key: 'abc' }]}
      value={data ?? searchText}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          onChange={e => handleInput(e.target.value)}
        />
      )}
      onChange={(_, data) => {
        handleChange(path, data);
      }}
      noOptionsText={
        searchText.length < minChars
          ? 'Type more characters to start search'
          : noResultsText
      }
      filterOptions={x => x}
      loading={loading}
      loadingText="Searching..."
    />
  ) : null;
};

export default withJsonFormsControlProps(Autocomplete as any);

export const autocompleteTester = rankWith(
  4, //increase rank as needed
  uiTypeIs('Autocomplete'),
);
