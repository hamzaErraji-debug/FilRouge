'use client';

import { useDebugValue, useState } from 'react';
import { FiZap, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addProgramAsync } from '@/app/lib/Redux/programSlice';
import { addNotification } from '@/app/lib/Redux/NotificationSlice';

export default function AddProgram() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API;
  const cloudinaryURL = process.env.NEXT_PUBLIC_CLOUDINARY;
  const Preset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
  const dispatch = useDispatch();
  
  const [loadingAI, setLoadingAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors , setErrors]=useState({})
  const [form, setForm] = useState({
    name: '',
    description: '',
    level: '',
    goal: '',
    duration: '',
    price: '',
    image: null,
  });

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
  const goals = ['Fat Loss', 'Strength', 'Wellness', 'Speed'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

const handleAIDescription = async () => {

  if (!form.name || !form.level || !form.goal) {
    return alert("Fill all fields!");
  }

  const prompt = `Write a concise, catchy, and professional description for a fitness program named "${form.name}".
        It lasts ${form.duration}, is designed for ${form.level} level users,
        and focuses on the goal of ${form.goal}.
        Keep it motivating and benefit-focused.`;

  try {
     setLoadingAI(true);
    const res = await axios.post("/api/ai-description", { prompt });
    console.log(res);
    
    setForm({ ...form, description: res.data.result});
  } catch (error) {
    console.error(error);
    setForm({ ...form, description: "Failed to generate description." });
  } finally{
     setLoadingAI(false);
  }
};


  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', Preset);

    const res = await axios.post(
        cloudinaryURL,
        formData
  );

  return res.data.secure_url; 
};

const handleSubmit = async(e) => {
  e.preventDefault();
  

  let valid = true;
  const newError = {};

  if (!form.name.trim()) {
    newError.name = 'Name is required';
    valid = false;
  }
  if (!form.description.trim()) {
    newError.description = 'Description is required';
    valid = false;
  }
  if (!form.level.trim()) {
    newError.level = 'Level is required';
    valid = false;
  }
  if (!form.goal.trim()) {
    newError.goal = 'Goal is required';
    valid = false;
  }
  if (!form.duration.trim()) {
    newError.duration = 'Duration is required';
    valid = false;
  }

  if (!form.price || Number(form.price) <= 0) {
    newError.price = 'Valid price is required';
    valid = false;
  }

  if(!form.image || (typeof form.image === 'string' && !form.image.trim())) {
    newError.image = 'Image is required';
    valid = false;
  }

  if (!valid) {
    setErrors(newError);
  } else {
    setErrors({});

    try {
      setLoading(true)
        
      const imageUrl = await uploadToCloudinary(form.image);
      dispatch(addProgramAsync({...form,image:imageUrl}))
      dispatch(addNotification({
        type: "programs",
        title: "Programs Added",
        message: `${form.name} added successfully`,
        type:'new'
      }))
       toast.success("Program addes successfully")

        router.push('/admin/dashboard/programs')
    } catch (error) {
        toast.error('Failed to generate description')
        console.error('Failed to save:', error.message);
    }finally{
        setLoading(false)
    }
}



};


  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={() => router.push('/admin/dashboard/programs')}
        className="cursor-pointer flex items-center gap-2 mb-6 text-gray-400 hover:text-white text-sm font-bold"
      >
        <FiArrowLeft />
        Back to Programs
      </button>

      <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-6">
        Add New Program
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/50 p-6 rounded-xl space-y-4 shadow-md"
      >
        {/* Program Name */}
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase text-gray-400 mb-1">
            Program Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter program name"
            className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            
          /> 
          {errors.name &&(<p className='text-red-600 text-[13px]'>{errors.name}</p>)} 
        </div>


        {/* Image Upload */}
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase text-gray-400 mb-1">
            Program Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-300"
            
          />
          {form.image && (
            <p className="text-xs text-green-400 mt-1">{form.image.name}</p>
          )}
          {errors.image &&(<p className='text-red-600 text-[13px]'>{errors.image}</p>)} 
        </div>

        

        {/* Level & Goal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-gray-400 mb-1">
              Level
            </label>
            <select
              name="level"
              value={form.level}
              onChange={handleInputChange}
              className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              
            >
              <option value="">Select level</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            {errors.level &&(<p className='text-red-600 text-[13px]'>{errors.level}</p>)} 

          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-gray-400 mb-1">
              Goal
            </label>
            <select
              name="goal"
              value={form.goal}
              onChange={handleInputChange}
              className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              
            >
              <option value="">Select goal</option>
              {goals.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
            {errors.goal &&(<p className='text-red-600 text-[13px]'>{errors.goal}</p>)} 

          </div>
        </div>

        {/* Duration & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Duration */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-gray-400 mb-1">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleInputChange}
              placeholder="e.g. 8 weeks"
              className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {errors.duration && (
              <p className="text-red-600 text-[13px]">{errors.duration}</p>
            )}
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase text-gray-400 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleInputChange}
              placeholder="e.g. 99"
              min="0"
              className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {errors.price && (
              <p className="text-red-600 text-[13px]">{errors.price}</p>
            )}
          </div>
        </div>


        {/* Description */}
        <div className="flex flex-col">
          <label className="text-xs font-bold uppercase text-gray-400 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Enter program description"
            rows={4}
            className="bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            
          ></textarea>
            {errors.description &&(<p className='text-red-600 text-[13px]'>{errors.description}</p>)} 

          <button
            type="button"
            onClick={handleAIDescription}
            className="flex items-center gap-2 mt-2 text-xs font-bold uppercase px-3 py-2 rounded-lg bg-gray-900/50 text-emerald-500 hover:bg-gray-900/70 transition"
          >
            <FiZap className="w-4 h-4" />
            Generate AI Description
          </button>

          {loadingAI && (
                <p className="mt-2 text-sm text-yellow-400">
                AI is generating the description...
                </p>
            )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 cursor-pointer bg-emerald-500 text-black font-bold uppercase py-3 rounded-lg hover:bg-emerald-400 transition-shadow shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          {loading ?'loading ...':"Add Program"}
        </button>
      </form>
    </div>
  );
}
