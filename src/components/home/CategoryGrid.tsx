'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCategories } from '@/hooks/useApiData';
import Icon from '@/components/ui/Icon';
import ProductPlaceholder from '@/components/ui/ProductPlaceholder';
import VineDecoration from '@/components/ui/VineDecoration';

/**
 * ULTRA-ELITE CATEGORY CARD
 * Features: 
 * - 3D Perspective Tilt with Spring Physics
 * - Dynamic Light Source (Jewel Shine) following mouse
 * - Parallax Layering for depth
 * - Sophisticated Glassmorphism UI
 */
function EliteCategoryCard({ category }: { category: import('@/lib/types').Category }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion Values for Mouse Position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth Spring Physics for "Elite" feel
  const springConfig = { stiffness: 150, damping: 20 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // 3D Transformations
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  
  // Parallax Depth Layers
  const contentZ = useTransform(mouseXSpring, [-0.5, 0.5], ["10px", "-10px"]);
  
  // Dynamic Shine Gradient following mouse
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize to -0.5 to 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <Link href={`/catalogo?cat=${category.id}`} className="group block outline-none">
        <div 
          className="relative perspective-1000"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          ref={cardRef}
        >
          {/* Main Card Body */}
          <motion.div
            style={{ 
              rotateX, 
              rotateY, 
              transformStyle: "preserve-3d" 
            }}
            className="relative aspect-square w-full rounded-xl overflow-hidden bg-white shadow-sm group-hover:shadow-2xl transition-shadow duration-700"
          >
            {/* Background Image Layer */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ transform: "translateZ(0px)" }}
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <ProductPlaceholder tone="cream" label="" aspectRatio={1} />
              )}
            </motion.div>

            {/* Elite 3D Shine Overlay (More brilliant) */}
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.8) 0%, transparent 60%)`,
                transform: "translateZ(40px)"
              }}
            />

            {/* Parallax Content Container */}
            <motion.div 
              style={{ translateZ: contentZ }}
              className="absolute inset-0 z-30 flex flex-col justify-end p-8"
            >
              {/* Floating Glass Metadata Box (Brighter and clearer) */}
              <div className="bg-white/40 backdrop-blur-xl border border-white/40 p-6 rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-3xl italic tracking-tight text-stone-800 drop-shadow-sm">
                    {category.name}
                  </h3>
                  <div className="text-stone-400 group-hover:text-brand-orange transition-colors duration-500">
                    <Icon name="arrow-r" size={24} />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-500">
                    {category.count} piezas
                  </span>
                  <div className="h-px flex-1 bg-stone-200/50 group-hover:bg-brand-orange transition-all duration-700" />
                </div>
              </div>
            </motion.div>

            {/* Interaction Glow Layer (Light and subtle) */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-700" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryGrid() {
  const categories = useCategories();
  
  // Show only first 6 for absolute symmetry
  const displayCats = categories.slice(0, 6);

  return (
    <section className="section py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Elite Header */}
        <header className="mb-16 text-center">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 0.5, letterSpacing: "0.4em" }}
            viewport={{ once: true }}
            className="block text-[11px] uppercase text-stone-500 font-medium mb-4"
          >
            Curaduría Exclusiva
          </motion.span>
          <VineDecoration />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-6xl italic tracking-tighter text-stone-800"
          >
            Nuestras Colecciones
          </motion.h2>
        </header>

        {/* 3D Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {displayCats.map((cat) => (
            <EliteCategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
