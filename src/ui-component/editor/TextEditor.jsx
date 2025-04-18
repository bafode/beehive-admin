import { Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import Editor from './Editor';

export default function TextEditor({ name, control, ...other }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Editor
                    id={name}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!error}
                    helperText={
                        <FormHelperText error sx={{ px: 2, textTransform: 'capitalize' }}>
                            {error?.message}
                        </FormHelperText>
                    }
                    {...other}
                />
            )}
        />
    );
}
