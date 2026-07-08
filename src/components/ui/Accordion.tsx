'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

function AccordionItem({ title, children, isOpen: controlledIsOpen, onToggle }: AccordionItemProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;
  const toggle = onToggle ? onToggle : () => setLocalIsOpen(!localIsOpen);

  return (
    <div className="border-b border-stone-200">
      <button
        onClick={toggle}
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

interface AccordionProps {
  items: (AccordionItemProps & { id?: string })[];
  openIndex?: number | null;
  onToggleIndex?: (index: number | null) => void;
}

export default function Accordion({ items, openIndex, onToggleIndex }: AccordionProps) {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isControlled = openIndex !== undefined;
        const isOpen = isControlled ? openIndex === i : undefined;
        const onToggle = onToggleIndex ? () => onToggleIndex(openIndex === i ? null : i) : undefined;

        return (
          <div key={i} id={item.id}>
            <AccordionItem 
              title={item.title} 
              isOpen={isOpen}
              onToggle={onToggle}
            >
              {item.children}
            </AccordionItem>
          </div>
        );
      })}
    </div>
  );
}
