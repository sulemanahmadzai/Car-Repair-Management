import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative bg-gray-900 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"%3E%3Crect fill="%23333" width="1200" height="600"/%3E%3C/svg%3E\')',
        }}
      ></div>
      <div className="relative container mx-auto px-4 py-32">
        <div className="max-w-2xl">
          <span className="text-orange-500 font-semibold">
            Car Repair And Tuning Company
          </span>
          <h2 className="text-5xl font-bold text-white mt-4 mb-6">
            We are Qualified & Professional
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Quality Auto Repair WordPress Theme in Envato Market. We offer a
            variety of Custom services. alteration in some form, by injected
            humour.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
