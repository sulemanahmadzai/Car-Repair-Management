import { Star } from "lucide-react";

export default function TestimonialSection() {
  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Star className="w-8 h-8 text-white" />
          </div>
          <p className="text-xl text-gray-300 mb-8">
            "If you are going to use a passage of Lorem Ipsum, you need to be
            sure there isn't anything embarrassing hidden in the middle of text.
            All the Lorem Ipsum."
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
            <div className="text-left text-white">
              <h4 className="font-semibold">Jimmy Alex</h4>
              <span className="text-gray-400">SEO of Northy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
