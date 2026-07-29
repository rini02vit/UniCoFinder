import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 2, delay = 0 }) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  return (
    <motion.span
      viewport={{ once: true }}
      onViewportEnter={() => {
        if (!hasAnimated) {
          animate(count, value, { duration: duration, delay: delay });
          setHasAnimated(true);
        }
      }}
    >
      {rounded}
    </motion.span>
  );
};

export default AnimatedCounter;
