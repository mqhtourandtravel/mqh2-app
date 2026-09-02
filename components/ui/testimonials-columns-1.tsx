'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TestimonialItem {
  text: string;
  name: string;
  role: string;
  image?: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: '-50%',
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6 bg-background-cream"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="p-10 rounded-3xl border border-foreground/8 bg-white shadow-md max-w-xs w-full"
                  key={i}
                >
                  <div className="text-secondary text-4xl font-serif leading-none mb-3">
                    &ldquo;
                  </div>
                  <div className="text-[0.95rem] leading-[1.8] text-foreground/80">
                    {text}
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                        <span className="text-secondary font-semibold text-[0.85rem]">
                          {name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-foreground">
                        {name}
                      </div>
                      <div className="leading-5 opacity-60 tracking-tight text-foreground/70 text-sm">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
