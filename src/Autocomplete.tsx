/*
Autocomplete component for JSON Forms
*/

import { ControlProps, rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import { Autocomplete as MuiAutocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const Autocomplete = (props: ControlProps) => {
  const { uischema, visible, handleChange, path, label, data } = props;
  const {
    searchTextPath,
    options,
    noResultsText,
    minChars = 3,
  } = uischema?.options ?? {};
  const [searchText, setSearchText] = useState('');
  const [displayOptions, setDisplayOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const debounce = useDebouncedCallback(value => {
    if (value.length >= minChars) {
      handleChange(searchTextPath, value);
      handleChange(path, undefined);
      setLoading(true);
    }
  }, 500);

  useEffect(() => {
    setLoading(false);
    if (options.length > 0) setDisplayOptions(options);
  }, [options]);

  const handleInput = (text: string) => {
    setSearchText(text);
    setDisplayOptions([]);
    if (text.length >= minChars) {
      setLoading(true);
    }
    debounce(text);
  };

  return visible ? (
    <MuiAutocomplete
      options={displayOptions}
      value={data ?? searchText}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          onChange={e => handleInput(e.target.value)}
        />
      )}
      renderOption={(props, option) => {
        return (
          <li {...props} key={option.key}>
            {option.label}
          </li>
        );
      }}
      onChange={(_, data) => {
        setSearchText('');
        if (typeof data === 'object' && data !== null && 'value' in data)
          handleChange(path, data.value);
        else handleChange(path, data);
        handleChange(searchTextPath, undefined);
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
