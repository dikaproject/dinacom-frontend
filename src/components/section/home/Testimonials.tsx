// Testimonials.tsx
"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote: "PregnaCare has been invaluable throughout my pregnancy journey. The AI diagnosis feature helped me stay informed, and the doctors were always there when I needed them.",
      author: "Sarah Johnson",
      role: "First-time Mother",
      image: "/images/testimonial.jpg"
    },
    {
      id: 2,
      quote: "The community support and expert advice available through PregnaCare made me feel confident and supported during my second pregnancy.",
      author: "Maria Garcia",
      role: "Mother of Two",
      image: "/images/testimonial.jpg"
    },
    {
      id: 3,
      quote: "I love how easy it is to track my pregnancy progress and get instant answers through the AI chat. It's like having a personal pregnancy assistant.",
      author: "Emily Chen",
      role: "Expecting Mother",
      image: "/images/testimonial.jpg"
    }
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex >= testimonials.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = testimonials.length - 1;
      return nextIndex;
    });
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute transform rotate-45 w-96 h-96 bg-purple-200 -top-48 -left-48 rounded-full" />
        <div className="absolute transform rotate-45 w-96 h-96 bg-purple-200 -bottom-48 -right-48 rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              What Mothers Say
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Real experiences from our community
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative h-[400px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full"
              style={{ zIndex: 10 }}
            >
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl mx-auto max-w-3xl">
                {/* Quote Mark */}
                <div className="absolute -top-6 left-8 text-6xl text-purple-200">
                  &quot;
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Author Image */}
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
                    <Image
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].author}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                      {testimonials[currentIndex].quote}
                    </p>
                    <h4 className="font-semibold text-gray-800">
                      {testimonials[currentIndex].author}
                    </h4>
                    <p className="text-purple-500">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 z-20">
            <button
              onClick={() => paginate(-1)}
              className="p-2 rounded-full bg-white shadow-lg text-purple-600 hover:text-purple-700 transition-colors transform hover:scale-105 focus:outline-none"
              style={{ zIndex: 30 }}
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="p-2 rounded-full bg-white shadow-lg text-purple-600 hover:text-purple-700 transition-colors transform hover:scale-105 focus:outline-none"
              style={{ zIndex: 30 }}
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-purple-600' : 'bg-purple-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;