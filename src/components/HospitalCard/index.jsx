import {
  Star,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";

const HospitalCard = ({ hospital, onBook }) => (
  <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-teal-100 transition-all duration-300 group flex flex-col h-full overflow-hidden relative">
    {/* Image Container */}
    <div className="relative h-48 overflow-hidden bg-gray-100">
      <img
        src={hospital?.Image__c}
        alt={hospital?.Name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

      {/* Top Badges */}
      <div className="absolute top-3 left-3 flex gap-2">
        <div className="bg-teal-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-white/20">
          <ShieldCheck className="w-3 h-3" />
          GOVT. VERIFIED
        </div>
      </div>

      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        <span className="text-xs font-bold text-gray-800">
          {hospital?.rating}
        </span>
      </div>

      {/* Location on Image */}
      <div className="absolute bottom-3 left-3 right-3">
        <div className="flex items-center text-white/90 text-xs font-medium truncate">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-teal-300 flex-shrink-0" />
          {hospital?.District__r?.Name}, {hospital?.State__r?.Name}
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-snug group-hover:text-teal-700 transition-colors">
        {hospital.Name}
      </h3>
      <p className="text-xs text-gray-500 mb-4 line-clamp-1 flex items-center">
        {hospital.Address__c}
      </p>

      {/* Specialties */}
      {/* <div className="flex flex-wrap gap-1.5 mb-6">
        {hospital.specialties.slice(0, 3).map((spec, index) => (
          <span
            key={index}
            className="px-2.5 py-1 bg-gray-50 group-hover:bg-teal-50 text-gray-600 group-hover:text-teal-700 text-[11px] rounded-md font-semibold border border-gray-100 group-hover:border-teal-100 transition-colors"
          >
            {spec}
          </span>
        ))}
        {hospital.specialties.length > 3 && (
          <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] rounded-md font-semibold border border-gray-100">
            +{hospital.specialties.length - 3}
          </span>
        )}
      </div> */}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
            Next Slot
          </span>
          <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 w-fit">
            <CalendarCheck className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs font-bold">{hospital.nextAvailable}</span>
          </div>
        </div>

        <button
          onClick={() => onBook(hospital)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-teal-200 transition-all flex items-center gap-2 group/btn active:scale-95"
        >
          Book
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  </div>
);

export default HospitalCard;
