import Newsletter from "./parts/NewsSub";
import CategoryGrid from "./parts/Categories";
import Recent from "./parts/Recent";
import Hero from "./parts/Hero";
import Header from "./parts/Header";
import StepsSection from "./components/Steps";

export default function Home() {
  return (
    <div>
      <Header />
      <StepsSection />
      <Hero />
      <Recent />
      <CategoryGrid />
      <Newsletter />
    </div>
  );
}