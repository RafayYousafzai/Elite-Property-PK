import { propertyPlots } from "@/app/api/plotshomes";
import PropertyCard from "@/components/Home/Plots/Card/Card";

const PropertyPlots: React.FC = () => {
  return (
    <section className="pt-0!">
      <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {propertyPlots.slice(3, 6).map((item, index) => (
            <div key={index} className="">
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyPlots;
