import { useState } from "react";
import { Hero } from "../components/Hero";
import { Categories } from "../components/Categories";
import { Products } from "../components/Products";
import { PromoBanner } from "../components/PromoBanner";
import { About } from "../components/About";
import { Testimonials } from "../components/Testimonials";

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");

  return (
    <>
      <Hero />
      <Categories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <Products
        selectedCategory={selectedCategory}
        onFilterChange={setSelectedCategory}
      />
      <PromoBanner />
      <About />
      <Testimonials />
    </>
  );
}
