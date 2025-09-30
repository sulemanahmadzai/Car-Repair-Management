import { Clock, DollarSign } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Book Appointment
              </h3>
              <p className="text-gray-600">
                There are many variations of passages of Lorem
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Save Your Time
              </h3>
              <p className="text-gray-600">
                There are many variations of passages of Lorem
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Save Your Money
              </h3>
              <p className="text-gray-600">
                There are many variations of passages of Lorem
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
