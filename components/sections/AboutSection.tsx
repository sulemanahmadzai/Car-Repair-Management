import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
              <Car className="w-32 h-32 text-orange-500" />
            </div>
          </div>
          <div>
            <span className="text-orange-500 font-semibold">
              About Our Company
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">
              How We Can Help you
            </h2>
            <p className="text-gray-600 mb-4">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even
              slightly believable. If you are going to use a passage of Lorem
              Ipsum
            </p>
            <p className="text-gray-600 mb-8">
              There isn't anything embarrassing hidden in the middle of text.
              All the Lorem Ipsum generators on the Internet tend to repeat
              predefined chunks as necessary you need to be sure
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
              Read More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
