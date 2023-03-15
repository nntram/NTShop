import React, { useState } from 'react'
import { Carousel, CarouselIndicators, CarouselItem, CarouselControl } from 'reactstrap';
import HeroSlider from './HeroSlider'
import HeroSlider2 from './HeroSlider2'

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)

  const heroItems = [
    {
      id: 1,
      src: <HeroSlider />
    },
    {
      id: 2,
      src: <HeroSlider2 />
    }
  ];
  const onExiting = () => {
    setAnimating(true);
  }

  const onExited = () => {
    setAnimating(false);
  }

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === heroItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? heroItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex)
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex)
  }
  const slides = heroItems.map((item) => {
    return (
      <CarouselItem
        onExiting={onExiting}
        onExited={onExited}
        key={item.id}
      >       
        {item.src}       
      </CarouselItem>
    );
  });

  return (
    <section name='hero' className='p-0'>
        <Carousel
          activeIndex={activeIndex}
          next={next}
          previous={previous}
        >
          <CarouselIndicators items={heroItems} activeIndex={activeIndex} onClickHandler={goToIndex} />
          {slides}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
        </Carousel>
      </section>
  )
}

export default HeroSection
