'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-stone-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group"
      >
        <span className="font-serif text-xl md:text-2xl italic text-stone-800 group-hover:text-brand-orange transition-colors">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-stone-400 group-hover:text-brand-orange transition-colors"
        >
          <Icon name="chev-d" size={24} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-stone-600 leading-relaxed font-light">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Accordion({ items }: { items: AccordionItemProps[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <AccordionItem key={i} title={item.title}>
          {item.children}
        </AccordionItem>
      ))}
    </div>
  );
}
