import Image from "next/image";

const TestimonialCard = ({ name, company, image, feedback }) => {
  return (
    <div className="bg-slate-50 dark:bg-neutral-900 rounded-2xl p-6 max-w-md m-2 transition-colors">
      <div className="flex items-center">
        <Image
          src={"https://i.pravatar.cc/150?u=a042581f4e29026024d"}
          width={50}
          height={50}
        />
        <div className="ml-4">
          <h3 className="font-semibold text-black dark:text-white text-sm">
            {name}
          </h3>
          <p className="text-gray-800 dark:text-gray-400 text-xs">{company}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-200 text-wrap text-sm mt-3 leading-relaxed max-w-sm">
        {feedback}
      </p>
    </div>
  );
};

export default TestimonialCard;
