"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutLayout({ children }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <>
      <Header />

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen"
      >
        {children}
      </motion.main>

      <Footer />
    </>
  );
}
