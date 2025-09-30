import { Settings } from "lucide-react";

export default function ServicesSection() {
  const services = [
    { title: "Engine Repair", subtitle: "Subtitle Goes Here" },
    { title: "Tires Replacement", subtitle: "Subtitle Goes Here" },
    { title: "Transmission", subtitle: "Subtitle Goes Here" },
    { title: "Diagnostic", subtitle: "Subtitle Goes Here" },
    { title: "Batteries", subtitle: "Subtitle Goes Here" },
    { title: "Breaks", subtitle: "Subtitle Goes Here" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-semibold text-lg">
            What We Do
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            Our Services
          </h2>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <Settings className="w-16 h-16 text-orange-500" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
