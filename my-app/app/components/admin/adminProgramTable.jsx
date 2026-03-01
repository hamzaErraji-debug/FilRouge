'use client'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrograms, deleteProgramAsync, toggleProgramStatusAsync } from "@/app/lib/Redux/programSlice";
import { FiSearch, FiFilter, FiStar, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import DeleteDataPopUp from "./DeletePopUp";
import ExportButton from "./Export";
import { addNotification } from "@/app/lib/Redux/NotificationSlice";

export default function ProgramsTable() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: programs, loading } = useSelector(state => state.programs);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const rowsPerPage = 6;

  useEffect(() => {
    dispatch(fetchPrograms());
  }, [dispatch]);
  

  // Search filter
  const filteredPrograms = programs.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPrograms.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPrograms = filteredPrograms.slice(startIndex, startIndex + rowsPerPage);

  const showingText = filteredPrograms.length === 0
    ? "No results"
    : `${startIndex + 1}-${startIndex + currentPrograms.length} of ${filteredPrograms.length} results`;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleDelete = (id) => {
    dispatch(deleteProgramAsync(id));
    setShowDeleteModal(false);
    dispatch(addNotification({
      type: "program",
      title: "Program Deleted",
      message: `${selectedProgram.name} deleted successfully`,
      type:'deleted'
    }))
    setSelectedProgram(null);
  };

  const toggleActivation = (program) => {
    dispatch(toggleProgramStatusAsync(program));
  };

  return (
    <div className="max-w-7xl mx-auto bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Tabs + Add Button */}
      <div className="flex justify-between items-center border-b border-white/5 p-4">
        <h2 className="text-white font-bold uppercase">Programs</h2>
        <button
          onClick={() => router.push("/admin/dashboard/addprogram")}
          className="flex items-center cursor-pointer gap-2 bg-green-500 px-4 py-2 rounded-lg text-black font-bold hover:bg-green-600"
        >
          <FiPlus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {/* Search & Export */}
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between gap-4 items-center bg-black/20">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-600 outline-none"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <ExportButton data={programs} type="programs" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-white">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase font-bold border-b border-white/5">
              <th className="p-4">Name</th>
              <th className="p-4">Level & Goal</th>
              <th className="p-4 hidden md:table-cell">Description</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {currentPrograms.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No Results</td>
              </tr>
            ) : (
              currentPrograms.map(program => (
                <tr key={program.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 flex items-center gap-3">
                    <img src={program.image} alt={program.name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    <div>
                      <p className="font-bold text-white">{program.name}</p>
                      <p className="text-xs text-gray-500">Duration: {program.duration}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${program.level==='Beginner'?'bg-green-500/10 text-green-400 border-green-500/20':'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        {program.level}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${program.goal==='Fat Loss'?'bg-orange-500/10 text-orange-400 border-orange-500/20':'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                        {program.goal}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell ">
                    <p className="text-gray-400 line-clamp-2 w-62.5">
                      {program.description}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase ${program.status==='active'?'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20':'bg-white/5 text-gray-400 border border-white/10'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${program.status==='active'?'bg-emerald-500 animate-pulse':'bg-gray-500'}`}></span>
                      {program.status}
                    </span>
                  </td>
                  <td className="p-4  text-right flex justify-end gap-1">
                    <button onClick={() => toggleActivation(program)} className={`cursor-pointer p-2 rounded-lg transition-colors ${program.status==='active'?'text-emerald-500 bg-emerald-500/10':'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'}`}>
                      <FiStar className="w-4 h-4" />
                    </button>
                    <button onClick={()=>router.push(`/admin/dashboard/programs/edit/${program.id}`)} className=" cursor-pointer p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button onClick={()=>{setSelectedProgram(program); setShowDeleteModal(true)}} className=" cursor-pointer p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                      <FiTrash2 className="w-4 h-4" />
                    </button>

                    {showDeleteModal && selectedProgram && (
                      <DeleteDataPopUp
                        data={selectedProgram}
                        onCancel={()=>setShowDeleteModal(false)}
                        onDelete={()=>handleDelete(selectedProgram.id)}
                        loading={loading}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4 border-t border-white/5 bg-black/20">
        <p className="text-gray-400 text-sm">Showing: {showingText}</p>
        <div className="flex gap-2">
          <button disabled={currentPage===1} onClick={()=>setCurrentPage(currentPage-1)} className=" cursor-pointer w-8 h-8 flex items-center justify-center rounded bg-gray-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed">
            <FiChevronLeft className="w-4 h-4" />
          </button>
          {pages.map(page => (
            <button key={page} onClick={()=>setCurrentPage(page)} className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors ${currentPage===page?'bg-emerald-500 text-black':'bg-gray-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/30'}`}>
              {page}
            </button>
          ))}
          <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(currentPage+1)} className="cursor-pointer w-8 h-8 flex items-center justify-center rounded bg-gray-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed">
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
