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

'use client';

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

interface CreateComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  onComponentCreated: (component: any, productId: string) => void;
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
}: CreateComponentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    progress: 0,
    product_id: productId,
  });
  
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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
    if (!productId) {
      console.error("Product ID is null, cannot create component.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("components")
        .insert([{
          name: formData.name,
          progress: formData.progress,
          product_id: productId,
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        onComponentCreated(data[0], productId);
        onClose();
        setFormData({
          name: "",
          progress: 0,
          product_id: productId,
        });
      }
    } catch (error) {
      console.error("Error creating component:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      progress: 0,
      product_id: productId,
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-col items-start gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="relative w-full">
              <SheetTitle className="text-lg font-semibold mb-2">Create New Component</SheetTitle>
              <Input
                ref={nameInputRef}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Component Name"
                className="w-full text-lg font-semibold mb-4"
                required
              />
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
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Component
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
