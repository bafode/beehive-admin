import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AppMultipleSelect({ sponsorsData, value, onChange }) {
    return (
        <Autocomplete
            multiple
            id="sponsors-outlined"
            options={sponsorsData ? sponsorsData : []}
            disableCloseOnSelect
            value={value}
            onChange={(event, newValue) => {
                onChange(newValue);
            }}
            getOptionLabel={(option) => option.companyName}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.companyName}
                </li>
            )}
            style={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Sponsors" placeholder="Favorites" />}
        />
    );
}
