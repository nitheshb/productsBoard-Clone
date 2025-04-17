// 'use client';
// import { useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';

// interface CreateProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onProductCreated: (product: any) => void;
// }

// export default function CreateProductModal({ isOpen, onClose, onProductCreated }: CreateProductModalProps) {
//   const [formData, setFormData] = useState({
//     name: '',
//     status: 'Todo', // Default value
//     progress: 0,     // Default value
//     team: '',
//     days: null,
//     startDate: null,
//     targetDate: null,
//     completedOn: null,
//     remarks: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value === '' ? null : value, // Handle empty strings as null for nullable fields
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const { data, error } = await supabase
//         .from('products')
//         .insert([formData])
//         .select();

//       if (error) throw error;

//       onProductCreated(data[0]);
//       onClose();
//       setFormData({
//         name: '',
//         status: 'Todo',
//         progress: 0,
//         team: '',
//         days: null,
//         startDate: null,
//         targetDate: null,
//         completedOn: null,
//         remarks: '',
//       });
//     } catch (error) {
//       console.error('Error creating product:', error);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4">Create New Product</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Product Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Status
//             </label>
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             >
//               <option value="Todo">Todo</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Completed">Completed</option>
//               <option value="Blocked">Blocked</option>
//             </select>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Progress (%)
//             </label>
//             <input
//               type="number"
//               name="progress"
//               value={formData.progress}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               min={0}
//               max={100}
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Team
//             </label>
//             <input
//               type="text"
//               name="team"
//               value={formData.team}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Days
//             </label>
//             <input
//               type="number"
//               name="days"
//               value={formData.days === null ? '' : formData.days}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               min={0}
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Start Date
//             </label>
//             <input
//               type="date"
//               name="startDate"
//               value={formData.startDate === null ? '' : formData.startDate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Target Date
//             </label>
//             <input
//               type="date"
//               name="targetDate"
//               value={formData.targetDate === null ? '' : formData.targetDate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Completed On
//             </label>
//             <input
//               type="date"
//               name="completedOn"
//               value={formData.completedOn === null ? '' : formData.completedOn}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Remarks
//             </label>
//             <textarea
//               name="remarks"
//               value={formData.remarks}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               rows={3}
//             />
//           </div>

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               Create
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: any) => void;
}

export default function CreateProductModal({ isOpen, onClose, onProductCreated }: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'Todo',
    progress: 0,
    team: '',
    days: null,
    startDate: null,
    targetDate: null,
    completedOn: null,
    remarks: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([formData])
        .select();

      if (error) throw error;

      onProductCreated(data[0]);
      onClose();
      setFormData({
        name: '',
        status: 'Todo',
        progress: 0,
        team: '',
        days: null,
        startDate: null,
        targetDate: null,
        completedOn: null,
        remarks: '',
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Product</SheetTitle>
          <SheetDescription>
            Fill out the form below to create a new product.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                type="number"
                id="progress"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                min={0}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Input id="team" name="team" value={formData.team} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days">Days</Label>
              <Input
                type="number"
                id="days"
                name="days"
                value={formData.days === null ? '' : formData.days}
                onChange={handleChange}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate === null ? '' : formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                type="date"
                id="targetDate"
                name="targetDate"
                value={formData.targetDate === null ? '' : formData.targetDate}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completedOn">Completed On</Label>
              <Input
                type="date"
                id="completedOn"
                name="completedOn"
                value={formData.completedOn === null ? '' : formData.completedOn}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="min-h-[60px]"
              />
            </div>
          </div>
          <SheetFooter className="flex justify-end gap-2 absolute bottom-0 right-0 p-4">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit">Create</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}