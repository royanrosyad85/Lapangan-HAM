"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

export type Testimonial = {
  text: string
  image: string
  name: string
  role: string
}

type TestimonialsColumnProps = {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}

export function TestimonialsColumn({
  className,
  testimonials,
  duration = 10,
}: TestimonialsColumnProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className={className}>
      <motion.div
        animate={shouldReduceMotion ? undefined : { translateY: "-50%" }}
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }
        }
        className="flex flex-col gap-6 bg-background pb-6"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <article
                key={`${index}-${i}`}
                className="w-full max-w-xs rounded-3xl border bg-card p-8 text-card-foreground shadow-lg shadow-primary/10"
              >
                <p className="text-sm leading-relaxed">{text}</p>

                <div className="mt-5 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`${name} from ${role}`}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <span className="font-medium leading-5 tracking-tight">
                      {name}
                    </span>
                    <span className="leading-5 tracking-tight text-muted-foreground">
                      {role}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}
