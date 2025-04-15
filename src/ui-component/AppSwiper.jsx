import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import slider1 from 'assets/images/slider1.jpg';
import slider2 from 'assets/images/slider2.webp';
import slider3 from 'assets/images/slider3.webp';
import slider4 from 'assets/images/slider4.webp';
// import required modules
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export default function AppSwiper() {
    return (
        <>
            <Swiper
                loop
                slidesPerView={3}
                autoplay={{ delay: 2000 }}
                spaceBetween={40}
                freeMode={true}
                modules={[FreeMode, Pagination, Autoplay]}
                pagination={{
                    clickable: true
                }}
                style={{ paddingBottom: '40px' }}
            >
                <CustomSwiper>
                    <CustomBox>
                        <Typography variant="h3">Red Star FC vs Paris FC</Typography>
                    </CustomBox>
                    <img style={{ width: '100%' }} src={slider1} alt="slider" />
                </CustomSwiper>
                <CustomSwiper>
                    <CustomBox>
                        <Typography variant="h3"> Red Star FC vs Paris FC</Typography>
                    </CustomBox>
                    <img style={{ width: '100%' }} src={slider2} alt="slider" />
                </CustomSwiper>
                <CustomSwiper>
                    <CustomBox>
                        <Typography variant="h3"> Red Star FC vs Paris FC </Typography>
                    </CustomBox>
                    <img style={{ width: '100%' }} src={slider3} alt="slider" />
                </CustomSwiper>
                <CustomSwiper>
                    <CustomBox>
                        <Typography variant="h3"> Red Star FC vs Paris FC</Typography>
                    </CustomBox>
                    <img style={{ width: '100%' }} src={slider4} alt="slider" />
                </CustomSwiper>
            </Swiper>
        </>
    );
}

const CustomBox = styled(Box)(() => ({
    position: 'absolute',
    textAlign: 'left',
    padding: '1rem',
    bottom: 0,
    left: 0,
    background: 'white',
    width: '100%',
    height: '1.5rem'
    // opacity: 0.8
}));

const CustomSwiper = styled(SwiperSlide)(() => ({
    overflow: 'hidden',
    position: 'relative',
    border: '3px solid white'
}));
