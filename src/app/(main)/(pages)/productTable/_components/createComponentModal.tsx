// // // components/CreateComponentModal.tsx

// // import { useState } from "react";
// // import { supabase } from "@/lib/supabaseClient";
// // import { Button } from "@/components/ui/button";
// // import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// // import { Label } from "@/components/ui/label";
// // import { Input } from "@/components/ui/input";

// // interface CreateComponentModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   productId: string | null;
// //   onComponentCreated: (component: any, productId: string) => void;
// // }

// // export function CreateComponentModal({
// //   isOpen,
// //   onClose,
// //   productId,
// //   onComponentCreated,
// // }: CreateComponentModalProps) {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     status: "Todo",
// //     progress: 0,
// //   });

// //   const handleChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
// //   ) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: value === "" ? null : value,
// //     }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();

// //     if (!productId) {
// //       console.error("Product ID is null, cannot create component.");
// //       return;
// //     }

// //     try {
// //       const { data, error } = await supabase
// //         .from("components")
// //         .insert([
// //           {
// //             name: formData.name,
// //             progress: formData.progress,
// //             product_id: productId,
// //           },
// //         ])
// //         .select();

// //       if (error) throw error;

// //       if (data && data.length > 0) {
// //         onComponentCreated(data[0], productId);
// //         onClose();
// //         setFormData({
// //           name: "",
// //           status: "Todo",
// //           progress: 0,
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Error creating component:", error);
// //     }
// //   };

// //   return (
// //     <Sheet open={isOpen} onOpenChange={onClose}>
// //       <SheetContent>
// //         <SheetHeader>
// //           <SheetTitle>Create New Component</SheetTitle>
// //           <SheetDescription>
// //             Fill out the form below to create a new component.
// //           </SheetDescription>
// //         </SheetHeader>
// //         <form onSubmit={handleSubmit} className="grid gap-4 py-4">
// //           <div className="space-y-2">
// //             <Label htmlFor="name">Component Name</Label>
// //             <Input
// //               id="name"
// //               name="name"
// //               value={formData.name}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>

// //           <SheetFooter className="flex justify-end gap-2 absolute bottom-0 right-0 p-4">
// //             <SheetClose asChild>
// //               <Button>Cancel</Button>
// //             </SheetClose>
// //             <Button variant="outline" type="submit">
// //               Create
// //             </Button>
// //           </SheetFooter>
// //         </form>
// //       </SheetContent>
// //     </Sheet>
// //   );
// // }



// 'use client';

// import { useState, useRef, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// interface CreateComponentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   productId: string | null;
//   onComponentCreated: (component: any, productId: string) => void;
// }

// function ComponentCreateTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`inline-block py-2 px-4 font-medium text-sm ${
//         isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// export function CreateComponentModal({
//   isOpen,
//   onClose,
//   productId,
//   onComponentCreated,
// }: CreateComponentModalProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     status: "Todo",
//     progress: 0,
//     priority: "Medium",
//     assigned_to: "",
//     due_date: "",
//     product_id: productId,
//   });
  
//   const [activeTab, setActiveTab] = useState('details');
//   const nameInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isOpen && nameInputRef.current) {
//       nameInputRef.current.focus();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (productId) {
//       setFormData(prev => ({
//         ...prev,
//         product_id: productId
//       }));
//     }
//   }, [productId]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value === "" ? null : value,
//     }));
//   };

//   const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
//     setActiveTab(tab);
//   };

//   const handleSubmit = async () => {
//     if (!productId) {
//       console.error("Product ID is null, cannot create component.");
//       return;
//     }

//     try {
//       const { data, error } = await supabase
//         .from("components")
//         .insert([{
//           name: formData.name,
//           description: formData.description,
//           status: formData.status,
//           progress: formData.progress,
//           priority: formData.priority,
//           assigned_to: formData.assigned_to,
//           due_date: formData.due_date,
//           product_id: productId,
//         }])
//         .select();

//       if (error) throw error;

//       if (data && data.length > 0) {
//         onComponentCreated(data[0], productId);
//         onClose();
//         setFormData({
//           name: "",
//           description: "",
//           status: "Todo",
//           progress: 0,
//           priority: "Medium",
//           assigned_to: "",
//           due_date: "",
//           product_id: productId,
//         });
//       }
//     } catch (error) {
//       console.error("Error creating component:", error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       status: "Todo",
//       progress: 0,
//       priority: "Medium",
//       assigned_to: "",
//       due_date: "",
//       product_id: productId,
//     });
//     onClose();
//   };

//   return (
//     <Sheet open={isOpen} onOpenChange={resetForm}>
//       <SheetContent className="sm:max-w-md overflow-y-auto">
//         <SheetHeader className="flex flex-col items-start gap-2">
//           <div className="flex items-center justify-between w-full">
//             <div className="relative w-full">
//               <SheetTitle className="text-lg font-semibold mb-2">Create New Component</SheetTitle>
//               <Input
//                 ref={nameInputRef}
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Component Name"
//                 className="w-full text-lg font-semibold mb-4"
//                 required
//               />
//             </div>
//           </div>

//           {/* Tab Navigation */}
//           <div className="mt-2 border-b w-full">
//             <ComponentCreateTab
//               label="Details"
//               isActive={activeTab === 'details'}
//               onClick={() => handleTabChange('details')}
//             />
//             <ComponentCreateTab
//               label="Insights"
//               isActive={activeTab === 'insights'}
//               onClick={() => handleTabChange('insights')}
//             />
//             <ComponentCreateTab
//               label="Portal"
//               isActive={activeTab === 'portal'}
//               onClick={() => handleTabChange('portal')}
//             />
//           </div>
//         </SheetHeader>

//         {/* Tab Content */}
//         {activeTab === 'details' && (
//           <div className="mt-4 space-y-3">
//             <div className="flex items-center gap-2">
//               <span className="text-gray-500 w-24">Description</span>
//               <div className="relative w-full">
//                 <Input
//                   name="description"
//                   value={formData.description || ''}
//                   onChange={handleChange}
//                   placeholder="Component description"
//                   className="w-full"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="text-gray-500 w-24">Status</span>
//               <div className="relative w-full">
//                 <Input
//                   name="status"
//                   value={formData.status || ''}
//                   onChange={handleChange}
//                   placeholder="Todo, In Progress, Done, etc."
//                   className="w-full"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="text-gray-500 w-24">Progress</span>
//               <div className="relative w-full">
//                 <Input
//                   name="progress"
//                   type="number"
//                   min="0"
//                   max="100"
//                   value={formData.progress || 0}
//                   onChange={handleChange}
//                   placeholder="0-100"
//                   className="w-full"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="text-gray-500 w-24">Priority</span>
//               <div className="relative w-full">
//                 <Input
//                   name="priority"
//                   value={formData.priority || ''}
//                   onChange={handleChange}
//                   placeholder="Low, Medium, High, etc."
//                   className="w-full"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="text-gray-500 w-24">Assigned To</span>
//               <div className="relative w-full">
//                 <Input
//                   name="assigned_to"
//                   value={formData.assigned_to || ''}
//                   onChange={handleChange}
//                   placeholder="Team member name or ID"
//                   className="w-full"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <span className="text-gray-500 w-24">Due Date</span>
//               <div className="relative w-full">
//                 <Input
//                   name="due_date"
//                   type="date"
//                   value={formData.due_date || ''}
//                   onChange={handleChange}
//                   className="w-full"
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'insights' && (
//           <div className="mt-4 p-4 text-gray-500 text-center">
//             Insights will be available after component creation.
//           </div>
//         )}

//         {activeTab === 'portal' && (
//           <div className="mt-4 p-4 text-gray-500 text-center">
//             Portal options will be available after component creation.
//           </div>
//         )}

//         {/* Footer with Actions */}
//         <div className="absolute bottom-0 right-0 p-4 flex justify-end gap-2 w-full border-t bg-white">
//           <Button variant="outline" onClick={resetForm}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit}>
//             Create Component
//           </Button>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }

// 'use client';

// import { useState, useRef, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// interface CreateComponentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   productId: string | null;
//   onComponentCreated: (component: any, productId: string) => void;
//   componentId?: string | null; // <-- new prop for update
// }

// function ComponentCreateTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`inline-block py-2 px-4 font-medium text-sm ${
//         isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// export function CreateComponentModal({
//   isOpen,
//   onClose,
//   productId,
//   onComponentCreated,
//   componentId = null,
// }: CreateComponentModalProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     progress: 0,
//     version: "1.0.0",
//     status: "Todo", // Added status field
//     product_id: productId,
//     startDate: null,
//     targetDate: null,
//     completedOn: null,
//   });
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('details');
//   const nameInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isOpen && nameInputRef.current) {
//       nameInputRef.current.focus();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (productId) {
//       setFormData(prev => ({
//         ...prev,
//         product_id: productId
//       }));
//     }
//   }, [productId]);

//   // Fetch component data if editing
//   useEffect(() => {
//     if (componentId && isOpen) {
//       setLoading(true);
//       fetch(`/api/component/${componentId}`)
//         .then(res => res.json())
//         .then(data => {
//           setFormData({
//             name: data.name || "",
//             progress: data.progress || 0,
//             version: data.version || "1.0.0",
//             status: data.status || "Todo", // Fetch status
//             product_id: data.product_id || productId,
//             startDate: data.startDate || null,
//             targetDate: data.targetDate || null,
//             completedOn: data.completedOn || null,
//           });
//         })
//         .finally(() => setLoading(false));
//     } else if (!componentId && isOpen) {
//       setFormData({
//         name: "",
//         progress: 0,
//         version: "1.0.0",
//         status: "Todo", // Default status for new component
//         product_id: productId,
//         startDate: null,
//         targetDate: null,
//         completedOn: null,
//       });
//     }
//   }, [componentId, isOpen, productId]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "progress" ? parseInt(value) || 0 : value,
//     }));
//   };

//   const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
//     setActiveTab(tab);
//   };

//   const handleSubmit = async () => {
//     if (!formData.product_id) {
//       toast.error("Product ID is null, cannot create/update component.");
//       return;
//     }
//     try {
//       let data, error;
//       if (componentId) {
//         // Update
//         const response = await fetch(`/api/component/${componentId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             ...formData,
//             updateProductProgress: true,
//           }),
//         });
//         if (!response.ok) throw new Error('Failed to update component');
//         data = [await response.json()];
//         toast.success("Component updated successfully!");
//       } else {
//         // Create
//         const res = await supabase
//           .from("components")
//           .insert([formData])
//           .select();
//         data = res.data;
//         error = res.error;
//         if (error) throw error;
//         toast.success("Component created successfully!");
//       }
//       if (data && data.length > 0) {
//         onComponentCreated(data[0], formData.product_id);
//         onClose();
//         setFormData({
//           name: "",
//           progress: 0,
//           version: "1.0.0",
//           status: "Todo", // Reset status
//           product_id: formData.product_id,
//           startDate: null,
//           targetDate: null,
//           completedOn: null,
//         });
//       }
//     } catch (error) {
//       toast.error("Error creating/updating component: " + (error instanceof Error ? error.message : String(error)));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: "",
//       progress: 0,
//       version: "1.0.0",
//       status: "Todo", // Reset status
//       product_id: productId,
//       startDate: null,
//       targetDate: null,
//       completedOn: null,
//     });
//     onClose();
//   };

//   return (
//     <Sheet open={isOpen} onOpenChange={resetForm}>
//       <SheetContent className="sm:max-w-md overflow-y-auto">
//         <SheetHeader className="flex flex-col items-start gap-2">
//           <div className="flex items-center justify-between w-full">
//             <div className="relative w-full">
//               <SheetTitle className="text-lg font-semibold mb-2">
//                 {componentId ? 'Edit Component' : 'Create New Component'}
//               </SheetTitle>
//               {/* Removed Component Name input from header */}
//             </div>
//           </div>
//           {/* Tab Navigation */}
//           <div className="mt-2 border-b w-full">
//             <ComponentCreateTab
//               label="Details"
//               isActive={activeTab === 'details'}
//               onClick={() => handleTabChange('details')}
//             />
//             <ComponentCreateTab
//               label="Insights"
//               isActive={activeTab === 'insights'}
//               onClick={() => handleTabChange('insights')}
//             />
//             <ComponentCreateTab
//               label="Portal"
//               isActive={activeTab === 'portal'}
//               onClick={() => handleTabChange('portal')}
//             />
//           </div>
//         </SheetHeader>
//         {/* Tab Content */}
//         {activeTab === 'details' && (
//           <div className="mt-4 space-y-3">
//             {/* Component Name */}
//             <div className="flex items-center gap-2">
//               <span className="text-gray-500 w-24">Name</span>
//               <div className="relative w-full">
//                 <Input
//                   ref={nameInputRef}
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="Component Name"
//                   className="w-full"
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//             {/* Status */}
//             <div className="flex items-center gap-2">
//               <span className="text-gray-500 w-24">Status</span>
//               <div className="relative w-full">
//                 <select
//                   name="status"
//                   value={formData.status || 'Todo'}
//                   onChange={handleChange}
//                   className="w-full px-3 h-[32px] border text-[14px] border-gray-300 rounded bg-white"
//                   disabled={loading}
//                 >
//                   <option value="Todo">Todo</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Completed">Completed</option>
//                   <option value="Blocked">Blocked</option>
//                 </select>
//               </div>
//             </div>
//             {/* Progress */}
//             <div className="flex items-center gap-2">
//               <span className="text-gray-500 w-24">Progress</span>
//               <div className="relative w-full">
//                 <Input
//                   name="progress"
//                   type="number"
//                   min="0"
//                   max="100"
//                   value={formData.progress}
//                   onChange={handleChange}
//                   placeholder="0-100"
//                   className="w-full"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//             {/* Version */}
//             <div className="flex items-center gap-2">
//               <span className="text-gray-500 w-24">Version</span>
//               <div className="relative w-full">
//                 <Input
//                   name="version"
//                   value={formData.version}
//                   onChange={handleChange}
//                   placeholder="e.g., 1.0.0"
//                   className="w-full"
//                   disabled={loading}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'insights' && (
//           <div className="mt-4 p-4 text-gray-500 text-center">
//             Insights will be available after component creation.
//           </div>
//         )}

//         {activeTab === 'portal' && (
//           <div className="mt-4 p-4 text-gray-500 text-center">
//             Portal options will be available after component creation.
//           </div>
//         )}

//         {/* Footer with Actions */}
//         <div className="absolute bottom-0 right-0 p-4 flex justify-end gap-2 w-full border-t bg-white">
//           <Button variant="outline" onClick={resetForm} disabled={loading}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
//             {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             {loading ? (componentId ? 'Updating...' : 'Creating...') : (componentId ? 'Update Component' : 'Create Component')}
//           </Button>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }











'use client';

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  onComponentCreated: (component: any, productId: string) => void;
  componentId?: string | null; // <-- new prop for update
}

function ComponentCreateTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-block py-2 px-4 font-medium text-sm ${
        isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

export function CreateComponentModal({
  isOpen,
  onClose,
  productId,
  onComponentCreated,
  componentId = null,
}: CreateComponentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    progress: 0,
    version: "1.0.0",
    status: "Todo", // Added status field
    product_id: productId,
    startDate: null,
    targetDate: null,
    completedOn: null,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (productId) {
      setFormData(prev => ({
        ...prev,
        product_id: productId
      }));
    }
  }, [productId]);

  // Fetch component data if editing
  useEffect(() => {
    if (componentId && isOpen) {
      setLoading(true);
      fetch(`/api/component/${componentId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            name: data.name || "",
            progress: data.progress || 0,
            version: data.version || "1.0.0",
            status: data.status || "Todo", // Fetch status
            product_id: data.product_id || productId,
            startDate: data.startDate || null,
            targetDate: data.targetDate || null,
            completedOn: data.completedOn || null,
          });
        })
        .finally(() => setLoading(false));
    } else if (!componentId && isOpen) {
      setFormData({
        name: "",
        progress: 0,
        version: "1.0.0",
        status: "Todo", // Default status for new component
        product_id: productId,
        startDate: null,
        targetDate: null,
        completedOn: null,
      });
    }
  }, [componentId, isOpen, productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "progress" ? parseInt(value) || 0 : value,
    }));
  };

  const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
    setActiveTab(tab);
  };

  const handleSubmit = async () => {
    if (!formData.product_id) {
      toast.error("Product ID is null, cannot create/update component.");
      return;
    }
    try {
      let data, error;
      if (componentId) {
        // Update
        const response = await fetch(`/api/component/${componentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            updateProductProgress: true,
          }),
        });
        if (!response.ok) throw new Error('Failed to update component');
        data = [await response.json()];
        toast.success("Component updated successfully!");
      } else {
        // Create via API (changed from direct Supabase insert to match server-side remapping)
        const response = await fetch('/api/component', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create component');
        }
        const newComponent = await response.json();
        data = [newComponent];
        toast.success("Component created successfully!");
      }
      if (data && data.length > 0) {
        onComponentCreated(data[0], formData.product_id);
        onClose();
        setFormData({
          name: "",
          progress: 0,
          version: "1.0.0",
          status: "Todo", // Reset status
          product_id: formData.product_id,
          startDate: null,
          targetDate: null,
          completedOn: null,
        });
      }
    } catch (error) {
      toast.error("Error creating/updating component: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      progress: 0,
      version: "1.0.0",
      status: "Todo", // Reset status
      product_id: productId,
      startDate: null,
      targetDate: null,
      completedOn: null,
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-col items-start gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="relative w-full">
              <SheetTitle className="text-lg font-semibold mb-2">
                {componentId ? 'Edit Component' : 'Create New Component'}
              </SheetTitle>
              {/* Removed Component Name input from header */}
            </div>
          </div>
          {/* Tab Navigation */}
          <div className="mt-2 border-b w-full">
            <ComponentCreateTab
              label="Details"
              isActive={activeTab === 'details'}
              onClick={() => handleTabChange('details')}
            />
            <ComponentCreateTab
              label="Insights"
              isActive={activeTab === 'insights'}
              onClick={() => handleTabChange('insights')}
            />
            <ComponentCreateTab
              label="Portal"
              isActive={activeTab === 'portal'}
              onClick={() => handleTabChange('portal')}
            />
          </div>
        </SheetHeader>
        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="mt-4 space-y-3">
            {/* Component Name */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-24">Name</span>
              <div className="relative w-full">
                <Input
                  ref={nameInputRef}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Component Name"
                  className="w-full"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-24">Status</span>
              <div className="relative w-full">
                <select
                  name="status"
                  value={formData.status || 'Todo'}
                  onChange={handleChange}
                  className="w-full px-3 h-[32px] border text-[14px] border-gray-300 rounded bg-white"
                  disabled={loading}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
            {/* Progress */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-24">Progress</span>
              <div className="relative w-full">
                <Input
                  name="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={handleChange}
                  placeholder="0-100"
                  className="w-full"
                  disabled={loading}
                />
              </div>
            </div>
            {/* Version */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-24">Version</span>
              <div className="relative w-full">
                <Input
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  placeholder="e.g., 1.0.0"
                  className="w-full"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="mt-4 p-4 text-gray-500 text-center">
            Insights will be available after component creation.
          </div>
        )}

        {activeTab === 'portal' && (
          <div className="mt-4 p-4 text-gray-500 text-center">
            Portal options will be available after component creation.
          </div>
        )}

        {/* Footer with Actions */}
        <div className="absolute bottom-0 right-0 p-4 flex justify-end gap-2 w-full border-t bg-white">
          <Button variant="outline" onClick={resetForm} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? (componentId ? 'Updating...' : 'Creating...') : (componentId ? 'Update Component' : 'Create Component')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
