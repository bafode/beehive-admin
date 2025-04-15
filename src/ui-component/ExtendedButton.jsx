import React from 'react';
import { Box, Button, SxProps } from '@mui/material';
import { Colors, Fonts } from '../../theme';

// export interface IButtonProps {
//   id: string;
//   dataTestId?: string;
//   label: string;
//   isDisabled: boolean;
//   isPrimary: boolean;
//   isContained: boolean;
//   isOutlined: boolean;
//   startIcon: boolean;
//   endIcon: boolean;
//   svgIcon: React.ReactNode;
//   onClick: React.MouseEventHandler<HTMLButtonElement> | unknown;
//   sx?: SxProps;
//   boxSx?: SxProps;
// }

export default function ExtendedButton(props) {
    return (
        <Box id={props.id} className="extended-button" sx={{ ...props.boxSx }}>
            <Button
                sx={{
                    ...Fonts.button,
                    '&:hover': {
                        backgroundColor: props.isContained ? (props.isPrimary ? Colors.primary : Colors.salmon) : ''
                    },
                    ...props.sx
                }}
                color={props.isPrimary ? 'primary' : 'secondary'}
                variant={props.isContained ? 'contained' : props.isOutlined ? 'outlined' : undefined}
                disabled={props.isDisabled}
                data-testid={props.dataTestId || props.id}
                startIcon={props.startIcon && props.svgIcon}
                endIcon={props.endIcon && props.svgIcon}
                onClick={props.onClick}
            >
                {props.label}
            </Button>
        </Box>
    );
}
ExtendedButton.defaultProps = {
    isDisabled: false,
    isPrimary: true,
    isContained: true,
    isOutlined: false,
    startIcon: false,
    endIcon: false,
    svgIcon: undefined,
    onClick: undefined,
    sx: {}
};
