import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-orange-500">AUTO</span>LOGIC
            </div>
            <p className="text-gray-400 mb-6">
              Simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-orange-500 cursor-pointer" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent post</h3>
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-600 rounded"></div>
                <div>
                  <p className="text-sm text-gray-400">
                    Most Importent Issue For your car.
                  </p>
                  <span className="text-xs text-gray-500">18 Feb 2019</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-600 rounded"></div>
                <div>
                  <p className="text-sm text-gray-400">
                    Most Importent Issue For your car.
                  </p>
                  <span className="text-xs text-gray-500">18 Feb 2019</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Address</h3>
            <div className="space-y-2 text-gray-400">
              <p>Head Office Address</p>
              <p>121 King Street, Melbourne West,</p>
              <p>Australia</p>
              <div className="mt-4 space-y-1">
                <p>
                  <span className="text-white">Phone:</span> 888 123-4587
                </p>
                <p>
                  <span className="text-white">Email:</span> info@example.com
                </p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Engine Repair</li>
              <li>Tire Replacement</li>
              <li>Trandmission</li>
              <li>Diagnostic</li>
              <li>Batteries</li>
              <li>Break Repair</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-gray-400">
            <span>Privacy Policy | © 2019 Autalogic. All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
