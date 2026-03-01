'use client'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "@/app/lib/Redux/productSlice";
import { useRouter } from "next/navigation";
import { FiSearch, FiFilter, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import DeleteDataPopUp from "./DeletePopUp";
import ExportButton from "./Export";
import { addNotification } from "@/app/lib/Redux/NotificationSlice";

export default function ProductTable() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: products, loading } = useSelector(state => state.products);
  console.log(products);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const rowsPerPage = 6;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalResults = filteredProducts.length;
  const totalPages = Math.ceil(totalResults / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Delete product
  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    setShowDeleteModal(false);
    dispatch(addNotification({
      type: "product",
      title: "Product Deleted",
      message: `${selectedProduct.name} deleted successfully`,
      type:'deleted'
    }))
    setSelectedProduct(null);
  };
  
  return (
    <div className="max-w-7xl mx-auto my-20 bg-gray-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Header + Add Button */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white">Products</h2>
        </div>
        <button
          onClick={() => router.push("/admin/dashboard/products/add")}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-lg bg-green-500 text-black font-bold hover:bg-green-600 transition"
        >
          <FiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search & Export */}
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-black/20">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 bg-gray-900 border border-white/10 px-3 py-2 text-xs font-bold uppercase text-gray-300 hover:text-white rounded-lg transition-colors">
            <FiFilter className="w-4 h-4" /> Filter
          </button>
          <ExportButton data={products} type="products" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-white">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase font-bold tracking-wider border-b border-white/5">
              <th className="p-4">Product Name</th>
              <th className="p-4">Price</th>
              <th className="p-4 hidden md:table-cell">Description</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No Results</td>
              </tr>
            ) : (
              currentProducts.map(product => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                    <div>
                      <p className="font-bold text-white">{product.name}</p>
                      <p className="text-xs text-gray-500">Created: {product.createdAt?.split("T")[0]}</p>
                    </div>
                  </td>
                  <td className="p-4 text-white">${product.price}</td>
                  <td className="p-4 hidden md:table-cell ">
                    <p className="text-gray-400 line-clamp-2 max-w-62.5">
                    
                    {product.description}
                    </p>
                  </td>
                  <td className="p-4 text-white">{product.stock}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => router.push(`/admin/dashboard/products/edit/${product.id}`)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"><FiEdit /></button>
                    <button onClick={() => { setSelectedProduct(product); setShowDeleteModal(true); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><FiTrash2 /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-white/5 bg-black/20">
        <p className="text-gray-400 text-sm">
          Showing {startIndex + 1}-{Math.min(endIndex, totalResults)} of {totalResults} results
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="w-8 h-8 flex items-center justify-center rounded bg-gray-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          {pages.map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors ${
                currentPage === page ? "bg-emerald-500 text-black" : "bg-gray-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="w-8 h-8 flex items-center justify-center rounded bg-gray-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <DeleteDataPopUp
          data={selectedProduct}
          onCancel={() => setShowDeleteModal(false)}
          onDelete={() => handleDelete(selectedProduct.id)}
          loading={loading}
        />
      )}
    </div>
  );
}
