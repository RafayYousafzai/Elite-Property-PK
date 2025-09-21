import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="!py-0">
      <div className="bg-gradient-to-b from-skyblue via-lightskyblue dark:via-[#4298b0] to-white/10 dark:to-black/10 overflow-hidden relative">
        <div className="container max-w-8xl mx-auto px-5 2xl:px-0 pt-32 md:pt-60 md:pb-68">
          <div className="relative text-white dark:text-dark text-center md:text-start z-10">
            <h1 className="text-inherit text-6xl sm:text-8xl font-semibold -tracking-wider md:max-w-45p mb-4">
              Live Luxury.
            </h1>
            <p className="text-inherit text-xm font-medium md:max-w-md">
              Discover exclusive plots and luxury apartments in DHA Islamabad
              with Arham Real Estate. Secure investments, modern living, and
              timeless elegance all in one prestigious community.
            </p>
            <div className="flex flex-col xs:flex-row justify-center md:justify-start gap-4 mt-4">
              <Link
                href="/contactus"
                className="px-8 py-4 border border-white dark:border-dark bg-white dark:bg-dark text-dark dark:text-white duration-300 dark:hover:text-dark hover:bg-transparent hover:text-white text-base font-semibold rounded-full hover:cursor-pointer"
              >
                Get in touch
              </Link>
              <button className="px-8 py-4 border border-white dark:border-dark bg-transparent text-white dark:text-dark hover:bg-white dark:hover:bg-dark dark:hover:text-white hover:text-dark duration-300 text-base font-semibold rounded-full hover:cursor-pointer">
                View Details
              </button>
            </div>
          </div>
          <div className="hidden md:block absolute -top-2 -right-68">
            <Image
              src={"/images/hero/heroBanner.png"}
              alt="heroImg"
              width={1082}
              height={1016}
              priority={false}
              unoptimized={true}
            />
          </div>
        </div>
        {/* add something here */}
        <div className="md:absolute bottom-0 md:-right-68 xl:right-0 bg-white dark:bg-black py-12 px-8 mobile:px-16 md:pl-16 md:pr-[195px] rounded-2xl md:rounded-none md:rounded-tl-2xl mt-24">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:flex gap-16 md:gap-24 sm:text-center dark:text-white text-black">
            <div className="flex flex-col sm:items-center gap-3">
              <p className="text-2xl sm:text-3xl font-medium text-inherit">
                500+
              </p>
              <p className="text-sm sm:text-base font-normal text-black/50 dark:text-white/50">
                Premium Properties
              </p>
            </div>
            <div className="flex flex-col sm:items-center gap-3">
              <p className="text-2xl sm:text-3xl font-medium text-inherit">
                $2.5B+
              </p>

              <p className="text-sm sm:text-base font-normal text-black/50 dark:text-white/50">
                Properties Sold
              </p>
            </div>
            <div className="flex flex-col sm:items-center gap-3">
              <p className="text-2xl sm:text-3xl font-medium text-inherit">
                15+
              </p>
              <p className="text-sm sm:text-base font-normal text-black/50 dark:text-white/50">
                Years Experience
              </p>
            </div>
            <div className="flex flex-col sm:items-center gap-3">
              <p className="text-2xl sm:text-3xl font-medium text-inherit">
                98%
              </p>
              <p className="text-sm sm:text-base font-normal text-black/50 dark:text-white/50">
                Client Satisfaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
