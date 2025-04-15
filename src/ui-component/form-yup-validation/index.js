import * as yup from 'yup';

yup.addMethod(yup.string, 'emptyHtmlCheck', function (message) {
    return this.test('emptyHtmlCheck', message, function (value) {
        const { path, createError } = this;
        if (value === '<p><br></p>') {
            return createError({ path, message });
        }
        return true;
    });
});

export const partnerOfferValidationSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().emptyHtmlCheck('Description cannot be empty').required('Description is required'),
    image: yup.mixed().required('Image is required'),
    terms: yup.string(),
    category: yup
        .string()
        .oneOf(
            [
                'Mode',
                'Technologie',
                'Alimentation',
                'Sport',
                'Beauté',
                'Santé',
                'Voyages',
                'Automobile',
                'Maison',
                'Services',
                'Événements'
            ],
            'Invalid category'
        )
        .required('Category is required'),
    status: yup.string().oneOf(['Active', 'Expired', 'Upcoming'], 'Invalid status')
});
