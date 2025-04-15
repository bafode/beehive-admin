import * as yup from 'yup';
const partnerValidationSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    gender: yup.string().required('Gender is required'),
    phoneNumber: yup.string().required('Phone number is required')
});

export { partnerValidationSchema };
