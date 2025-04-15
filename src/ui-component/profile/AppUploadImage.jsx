import React, { useState } from 'react';
import { Fab } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import { useController } from 'react-hook-form';

const AppImageUpload = ({ name, control, height }) => {
    const { field, fieldState } = useController({ name, control });

    return (
        <ImageUploadComponent
            height={height}
            register={field}
            value={field.value}
            setValue={field.onChange}
            clearErrors={field.onBlur}
            name={name}
            error={fieldState.error}
        />
    );
};

export default AppImageUpload;

const ImageUploadComponent = ({ setValue, clearErrors, name, value, error, height }) => {
    const [selectedFile, setSelectedFile] = useState();
    const handleUploadClick = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setSelectedFile(reader.result);
            setValue(file);
            clearErrors(name);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const imageResetHandler = () => {
        setSelectedFile(null);
        setValue(null);
    };

    return (
        <Box
            sx={{
                border: `1px solid ${error ? 'red' : '#ddd'}`,
                padding: 1,
                borderRadius: '8px',
                position: 'relative',
                height: height || 'auto'
            }}
        >
            {(selectedFile || value) && (
                <Fab onClick={imageResetHandler} component="span" sx={{ position: 'absolute', bottom: 10, left: 10 }}>
                    <DeleteIcon color="error" />
                </Fab>
            )}
            <label htmlFor="contained-button-file">
                <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        objectFit: 'contain',
                        overflow: 'hidden',
                        border: !selectedFile ? '1px dashed blue' : ''
                    }}
                >
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleUploadClick}
                    />
                    {(selectedFile || value) && (
                        <>
                            <img width="100%" src={selectedFile || value} alt="Uploaded" style={{ width: 'auto', height: '100%' }} />
                        </>
                    )}
                    {!selectedFile && !value && (
                        <Fab component="span">
                            <AddPhotoAlternateIcon />
                        </Fab>
                    )}
                </Box>
            </label>
        </Box>
    );
};
