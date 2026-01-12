import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion'; // Importar o motion
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ResourceCard from './ResourceCard';

// Definimos as animações aqui
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Tempo entre cada foto
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ResourceCarousel = ({ cardData, t }) => {
    return (
        <motion.div 
            className="w-full mb-[120px] relative pb-6 mt-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
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
                }}
                className="w-full"
            >
                {cardData.map((card, index) => (
                    <SwiperSlide key={index}>
                        {/* Envolvemos o cartão com um motion.div para a animação individual */}
                        <motion.div variants={itemVariants}>
                            <ResourceCard
                                imageSrc={card.img}
                                epsKey={card.epsKey}
                                titleKey={card.titleKey}
                                descriptionKey={card.descKey}
                                t={t}
                            />
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.div>
    );
};

export default ResourceCarousel;