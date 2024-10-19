import CarouselSlider from "@/components/CarouselSlider";
import SearchProperty from "@/components/SearchProperty";
import herosearch from "@/assets/hero-search.svg";
import Footer from "@/components/Footer";

function Homepage() {
  return (
    <>
      <div className="container mx-auto max-w-[1300px] p-2">
        <CarouselSlider />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-8">
          <div>
            <SearchProperty />
          </div>
          <div>
            <img src={herosearch} alt="" className="rounded-md" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Homepage;
