import React, { useState, useRef } from 'react';
import { Fab } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';

const AppFileUpload = ({ setValue, clearErrors, name, error, minHeight }) => {
    const [mainState, setMainState] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleUploadClick = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setMainState(true);
            setSelectedFile(reader.result);
            setValue(name, file);
            clearErrors(name);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const imageResetHandler = () => {
        setMainState(false);
        setSelectedFile(null);
        setValue(name, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    return (
        <Box
            sx={{
                border: `1px solid ${error ? 'red' : '#ddd'}`,
                padding: 1,
                borderRadius: '8px',
                position: 'relative',
                height: '100%',
                minHeight: minHeight ? minHeight : 'auto'
            }}
        >
            {mainState && (
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
                        border: !mainState ? '1px dashed blue' : ''
                    }}
                >
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleUploadClick}
                        ref={fileInputRef}
                    />
                    {mainState && (
                        <>
                            <img width="100%" src={selectedFile} alt="Uploaded" />
                        </>
                    )}
                    {!mainState && (
                        <Fab component="span">
                            <AddPhotoAlternateIcon />
                        </Fab>
                    )}
                </Box>
            </label>
            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error.message}
                </Typography>
            )}
        </Box>
    );
};

export default AppFileUpload;
