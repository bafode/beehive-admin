import React from 'react';
import { Controller } from 'react-hook-form';
import { Checkbox, FormControlLabel, FormHelperText, FormControl } from '@mui/material';

const AppCheckboxField = ({ name, control, label, error, defaultValue = false, ...rest }) => {
    return (
        <FormControl error={!!error} component="fieldset">
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field: { onChange, value, ref } }) => (
                    <FormControlLabel
                        control={<Checkbox onChange={(e) => onChange(e.target.checked)} checked={value} inputRef={ref} {...rest} />}
                        label={label}
                    />
                )}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
    );
};

export default AppCheckboxField;
