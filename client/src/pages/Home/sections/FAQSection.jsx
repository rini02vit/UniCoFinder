import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Section from '../components/Section';
import SectionHeader from '../components/SectionHeader';
import { FAQ_CONFIG } from '../../../constants/home';
import { StaggerItem } from '../components/StaggerContainer';

const AccordionItem = ({ faq, isOpen, onClick }) => {
  const contentId = `faq-content-${faq.id}`;
  const headerId = `faq-header-${faq.id}`;

  return (
    <StaggerItem className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <h3>
        <button
          id={headerId}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={onClick}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          {faq.question}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </button>
      </h3>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-secondary)' }}>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </StaggerItem>
  );
};

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Section id="faq" staggerChildren={true}>
      <StaggerItem>
        <SectionHeader 
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about UniCoFinder and how it can help you."
        />
      </StaggerItem>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        {FAQ_CONFIG.map((faq, index) => (
          <AccordionItem 
            key={faq.id} 
            faq={faq} 
            isOpen={activeIndex === index}
            onClick={() => toggleAccordion(index)}
          />
        ))}
      </div>
    </Section>
  );
};

export default FAQSection;
