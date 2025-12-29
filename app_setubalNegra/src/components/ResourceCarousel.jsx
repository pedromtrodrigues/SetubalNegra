// components/ResourceCarousel.jsx

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ResourceCard from './ResourceCard';

const ResourceCarousel = ({ cardData, t }) => {
    return (
        // wrapper apenas com margem inferior
        <div className="w-full mb-[120px] relative pb-6">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                    640: { slidesPerView: 2.2, spaceBetween: 25 },
                    1024: { slidesPerView: 3, spaceBetween: 30 },
                }}
                pagination={{
                    type: 'progressbar',
                    hideOnClick: false,
                }}
                className="w-full"
            >
                {cardData.map((card, index) => (
                    <SwiperSlide key={index}>
                        <ResourceCard
                            imageSrc={card.img}
                            epsKey={card.epsKey}
                            titleKey={card.titleKey}
                            descriptionKey={card.descKey}
                            t={t}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ResourceCarousel;
