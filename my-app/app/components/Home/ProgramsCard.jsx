import { addToCart } from "@/app/lib/Redux/cartProgramSlice";
import { fetchPrograms } from "@/app/lib/Redux/programSlice";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FiShoppingCart, FiEye } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

export const ProgramsSection = () => {

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchPrograms())
  },[dispatch])

  const programs = useSelector(state=>state.programs.items).slice(0,5)
  


  return (
    <div className="max-w-7xl mx-auto my-12">
      <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
        <h2 className="pb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Active Programs
        </h2>
        <a
          className="text-sm font-bold text-green-400 uppercase tracking-wide hover:underline"
          href="/programs"
        >
          View All Programs
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
};

const ProgramCard = ({ program }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const price = Number(program.price).toFixed(2);

  return (
    <div className="relative group cursor-pointer">
      <div className="aspect-3/4 w-full overflow-hidden rounded-2xl bg-gray-800 relative shadow-lg">
        {/* Program image */}
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${program.image})` }}
        />

        {/* Level & Goal badges (always visible) */}
        <div className="absolute top-3 left-3 z-20 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">
          {program.level}
        </div>
        <div className="absolute top-3 right-3 z-20 bg-blue-500 text-black text-xs font-bold px-2 py-1 rounded">
          {program.goal}
        </div>

        {/* Hover overlay with centered View icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 rounded-2xl flex items-center justify-center">
          <button className="p-3 bg-black/70 rounded-full hover:bg-black/90 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            onClick={()=>router.push(`/programs/${program.id}`)}
          >
            <FiEye className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Bottom info: Name + Price + Cart */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-black/70 px-3 py-2 rounded-lg">
            <p className="text-lg font-bold text-white truncate">{program.name}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-green-400 font-bold">${price}</p>
              <button className="bg-white text-black p-2 cursor-pointer rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-400"
                onClick={()=>dispatch(addToCart(program))}
              >
                <FiShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


