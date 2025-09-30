import { Users, TrendingUp, Car } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { icon: Users, number: "300+", label: "Expert Technicians" },
    { icon: Users, number: "1026", label: "Satisfied Client" },
    { icon: TrendingUp, number: "25+", label: "Years Experience" },
    { icon: Car, number: "3215", label: "Compleate Project" },
  ];

  return (
    <section className="py-16 bg-orange-500">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 text-center text-white">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-4">
              <stat.icon className="w-12 h-12 mx-auto" />
              <h2 className="text-4xl font-bold">{stat.number}</h2>
              <p className="text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
