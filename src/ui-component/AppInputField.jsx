import React from 'react';
import { TextField, MenuItem, InputAdornment, IconButton } from '@mui/material';
import { Controller } from 'react-hook-form';
import { VisibilityOff, Visibility } from '@mui/icons-material';

const AppInputField = ({
    name,
    control,
    label,
    rows,
    type = 'text',
    disabled = false,
    select = false,
    options = [],
    adornment = null,
    showPassword,
    togglePassword,
    error,
    ...rest
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <TextField
                    {...field}
                    type={type === 'password' && showPassword ? 'text' : type}
                    label={label}
                    variant="outlined"
                    fullWidth
                    rows={rows}
                    disabled={disabled}
                    select={select}
                    {...rest}
                    InputProps={{
                        startAdornment: adornment && <InputAdornment position="start">{adornment}</InputAdornment>,
                        endAdornment:
                            type === 'password' ? (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePassword} edge="end" disabled={disabled}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                    }}
                    error={!!error}
                    helperText={error ? error.message : null}
                >
                    {select &&
                        options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>
            )}
        />
    );
};

export default AppInputField;
