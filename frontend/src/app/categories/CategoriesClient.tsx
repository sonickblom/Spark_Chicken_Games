"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { mockCategories } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function CategoriesClient() {
  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Categorias
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Explore nossa biblioteca de jogos organizada por categorias.
              Encontre exatamente o que você está procurando.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {mockCategories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="group block p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-neon-green/50 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all duration-500"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl" aria-hidden="true">
                      {category.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white group-hover:text-neon-green transition-colors mb-1">
                        {category.name}
                      </h2>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-neon-green font-medium">
                          {formatNumber(category.gameCount)} jogos
                        </span>
                        {category.isFeatured && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-full">
                            Destaque
                          </span>
                        )}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-600 group-hover:text-neon-green transition-colors flex-shrink-0 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
