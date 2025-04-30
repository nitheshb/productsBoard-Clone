// // // // components/CreateFeatureModal.tsx

// // // import { useState } from "react";
// // // import { supabase } from "@/lib/supabaseClient";
// // // import { Button } from "@/components/ui/button";
// // // import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// // // import { Label } from "@/components/ui/label";
// // // import { Input } from "@/components/ui/input";

// // // interface CreateFeatureModalProps {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   componentId: string | null;
// // //   onFeatureCreated: (feature: any, componentId: string) => void;
// // // }

// // // export function CreateFeatureModal({
// // //   isOpen,
// // //   onClose,
// // //   componentId,
// // //   onFeatureCreated,
// // // }: CreateFeatureModalProps) {
// // //   const [formData, setFormData] = useState({
// // //     name: "",
// // //     status: "Todo",
// // //     progress: 0,
// // //     team: "",
// // //     days: null,
// // //     startDate: null,
// // //     targetDate: null,
// // //     completedOn: null,
// // //     remarks: "",
// // //   });

// // //   const handleChange = (
// // //     e: React.ChangeEvent<
// // //       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
// // //     >
// // //   ) => {
// // //     const { name, value } = e.target;
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       [name]: value === "" ? null : value,
// // //     }));
// // //   };

// // //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// // //     e.preventDefault();

// // //     if (!componentId) {
// // //       console.error("Component ID is null, cannot create feature.");
// // //       return;
// // //     }

// // //     try {
// // //       const { data, error } = await supabase
// // //         .from("features")
// // //         .insert([{ ...formData, component_id: componentId }])
// // //         .select();

// // //       if (error) throw error;

// // //       if (data && data.length > 0) {
// // //         onFeatureCreated(data[0], componentId);
// // //         onClose();
// // //         setFormData({
// // //           name: "",
// // //           status: "Todo",
// // //           progress: 0,
// // //           team: "",
// // //           days: null,
// // //           startDate: null,
// // //           targetDate: null,
// // //           completedOn: null,
// // //           remarks: "",
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.error("Error creating feature:", error);
// // //     }
// // //   };

// // //   return (
// // //     <Sheet open={isOpen} onOpenChange={onClose}>
// // //       <SheetContent>
// // //         <SheetHeader>
// // //           <SheetTitle>Create New Feature</SheetTitle>
// // //           <SheetDescription>
// // //             Fill out the form below to create a new feature.
// // //           </SheetDescription>
// // //         </SheetHeader>
// // //         <form onSubmit={handleSubmit} className="grid gap-4 py-4">
// // //           <div className="space-y-2">
// // //             <Label htmlFor="name">Feature Name</Label>
// // //             <Input
// // //               id="name"
// // //               name="name"
// // //               value={formData.name}
// // //               onChange={handleChange}
// // //               required
// // //             />
// // //           </div>
// // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
// // //             <div className="space-y-2">
// // //               <Label htmlFor="status">Status</Label>
// // //               <select
// // //                 id="status"
// // //                 name="status"
// // //                 value={formData.status}
// // //                 onChange={handleChange}
// // //                 className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
// // //               >
// // //                 <option value="Todo">Todo</option>
// // //                 <option value="In Progress">In Progress</option>
// // //                 <option value="Completed">Completed</option>
// // //                 <option value="Blocked">Blocked</option>
// // //               </select>
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="progress">Progress (%)</Label>
// // //               <Input
// // //                 type="number"
// // //                 id="progress"
// // //                 name="progress"
// // //                 value={formData.progress === null ? "" : formData.progress}
// // //                 onChange={handleChange}
// // //                 min={0}
// // //                 max={100}
// // //               />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="team">Team</Label>
// // //               <Input
// // //                 id="team"
// // //                 name="team"
// // //                 value={formData.team}
// // //                 onChange={handleChange}
// // //               />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="days">Days</Label>
// // //               <Input
// // //                 type="number"
// // //                 id="days"
// // //                 name="days"
// // //                 value={formData.days === null ? "" : formData.days}
// // //                 onChange={handleChange}
// // //               />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="startDate">Start Date</Label>
// // //               <Input
// // //                 type="date"
// // //                 id="startDate"
// // //                 name="startDate"
// // //                 value={formData.startDate === null ? "" : formData.startDate}
// // //                 onChange={handleChange}
// // //               />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="targetDate">Target Date</Label>
// // //               <Input
// // //                 type="date"
// // //                 id="targetDate"
// // //                 name="targetDate"
// // //                 value={formData.targetDate === null ? "" : formData.targetDate}
// // //                 onChange={handleChange}
// // //               />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="completedOn">Completed On</Label>
// // //               <Input
// // //                 type="date"
// // //                 id="completedOn"
// // //                 name="completedOn"
// // //                 value={formData.completedOn === null ? "" : formData.completedOn}
// // //                 onChange={handleChange}
// // //               />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label htmlFor="remarks">Remarks</Label>
// // //               <Input
// // //                 id="remarks"
// // //                 name="remarks"
// // //                 value={formData.remarks}
// // //                 onChange={handleChange}
// // //                 className="min-h-[60px]"
// // //               />
// // //             </div>
// // //           </div>
// // //           <SheetFooter className="flex justify-end gap-2 absolute bottom-0 right-0 p-4">
// // //             <SheetClose asChild>
// // //               <Button variant="outline">Cancel</Button>
// // //             </SheetClose>
// // //             <Button type="submit">Create</Button>
// // //           </SheetFooter>
// // //         </form>
// // //       </SheetContent>
// // //     </Sheet>
// // //   );
// // // }



// // components/CreateFeatureModal.tsx

// import { useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// interface CreateFeatureModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   componentId: string | null;
//   onFeatureCreated: (feature: any, componentId: string) => void;
// }

// function FeatureTab({
//   label,
//   isActive,
//   onClick,
// }: {
//   label: string;
//   isActive: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`inline-block py-2 px-4 font-medium text-sm ${
//         isActive
//           ? "border-b-2 border-[#2693ff] text-[#2693ff]"
//           : "text-gray-500 hover:text-gray-700"
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// export function CreateFeatureModal({
//   isOpen,
//   onClose,
//   componentId,
//   onFeatureCreated,
// }: CreateFeatureModalProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     status: "Todo",
//     progress: 0,
//     team: "",
//     days: null,
//     startDate: null,
//     targetDate: null,
//     completedOn: null,
//     remarks: "",
//   });

//   const [activeTab, setActiveTab] = useState("details");

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value === "" ? null : value,
//     }));
//   };

//   const handleTabChange = (tab: string) => {
//     setActiveTab(tab);
//   };

//   // Calculate progress based on status
//   const calculateProgressFromStatus = (status: string): number => {
//     switch (status) {
//       case "Completed":
//         return 100;
//       case "In Progress":
//         return 50;
//       case "Todo":
//       default:
//         return 0;
//     }
//   };

//   // Update progress when status changes
//   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newStatus = e.target.value;
//     const newProgress = calculateProgressFromStatus(newStatus);
    
//     setFormData(prev => ({
//       ...prev,
//       status: newStatus,
//       progress: newProgress
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!componentId) {
//       console.error("Component ID is null, cannot create feature.");
//       return;
//     }

//     try {
//       const { data, error } = await supabase
//         .from("features")
//         .insert([{ ...formData, component_id: componentId }])
//         .select();

//       if (error) throw error;

//       if (data && data.length > 0) {
//         onFeatureCreated(data[0], componentId);
//         onClose();
//         setFormData({
//           name: "",
//           status: "Todo",
//           progress: 0,
//           team: "",
//           days: null,
//           startDate: null,
//           targetDate: null,
//           completedOn: null,
//           remarks: "",
//         });
//       }
//     } catch (error) {
//       console.error("Error creating feature:", error);
//     }
//   };

//   const renderDetailsTab = () => (
//     <div className="mt-4 space-y-3">
//       {/* Feature Name */}
//       <div className="space-y-2 mb-4">
//         <Label htmlFor="name" className="text-[#30363c] text-[14px]">Feature Name</Label>
//         <Input
//           id="name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           className="bg-white"
//           required
//         />
//       </div>

//       {/* Status dropdown - positioned at the top */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Status</span>
//         <select
//           id="status"
//           name="status"
//           value={formData.status}
//           onChange={handleStatusChange}
//           className="w-full px-3 h-[32px] border text-[14px] border-gray-300 rounded bg-white"
//         >
//           <option value="Todo">Todo</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Completed">Completed</option>
//           <option value="Blocked">Blocked</option>
//         </select>
//       </div>

//       {/* Progress field (automatically calculated based on status) */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Progress</span>
//         <div className="w-full flex items-center">
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div
//               className="bg-[#68b4ff] h-2.5"
//               style={{ width: `${formData.progress || 0}%` }}
//             ></div>
//           </div>
//           <span className="ml-2">{formData.progress || 0}%</span>
//         </div>
//       </div>

//       {/* Team */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Team</span>
//         <Input
//           id="team"
//           name="team"
//           value={formData.team || ""}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//           placeholder="Assign team"
//         />
//       </div>

//       {/* Days */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Days</span>
//         <Input
//           type="number"
//           id="days"
//           name="days"
//           value={formData.days === null ? "" : formData.days}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//           placeholder="Estimated days"
//         />
//       </div>

//       {/* Start Date */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Start Date</span>
//         <Input
//           type="date"
//           id="startDate"
//           name="startDate"
//           value={formData.startDate === null ? "" : formData.startDate}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//         />
//       </div>

//       {/* Target Date */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Target Date</span>
//         <Input
//           type="date"
//           id="targetDate"
//           name="targetDate"
//           value={formData.targetDate === null ? "" : formData.targetDate}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//         />
//       </div>

//       {/* Completed On */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Completed On</span>
//         <Input
//           type="date"
//           id="completedOn"
//           name="completedOn"
//           value={formData.completedOn === null ? "" : formData.completedOn}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//         />
//       </div>

//       {/* Remarks */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Remarks</span>
//         <Input
//           id="remarks"
//           name="remarks"
//           value={formData.remarks}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//           placeholder="Add remarks"
//         />
//       </div>
//     </div>
//   );

//   const renderInsightsTab = () => (
//     <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
//       <img 
//         className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]" 
//         src="/api/placeholder/230/172" 
//         alt="No insights yet"
//       />
//       <section className="flex flex-col items-center justify-center mt-4">
//         <h3 className="text-[#202428] text-[20px] font-bold">No direct insights just yet</h3>
//         <span className="text-[#939da7] text-[12px] font-semibold mt-[4px]">
//           Find relevant insights with search, or start adding insights manually
//         </span>
//       </section>
//     </section>
//   );

//   const renderPortalTab = () => (
//     <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
//       <img 
//         className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]" 
//         src="/api/placeholder/230/172" 
//         alt="Portal features" 
//       />
//       <section className="flex flex-col items-center justify-center mt-4">
//         <h3 className="text-[#202428] text-[20px] font-bold">Validate this idea</h3>
//         <span className="text-[#939da7] text-[12px] font-semibold mt-[4px]">
//           Collect votes and feedback by adding this idea to your portal
//         </span>
//       </section>
//     </section>
//   );

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent className="overflow-y-auto">
//         <form onSubmit={handleSubmit} className="h-full flex flex-col">
//           <SheetHeader className="flex flex-col items-start gap-2">
//             <div className="flex flex-col justify-between w-full">
//               <section className="flex gap-2 flex-row justify-between">
//                 <div className="flex flex-row">
//                   <span className="text-[#ffc600] mt-[2px] mr-[8px]">
//                     <svg
//                       height="16px"
//                       width="16px"
//                       viewBox="0 0 16 16"
//                       role="img"
//                       aria-label="FeatureIcon"
//                       className="ui-icon"
//                     >
//                       <path
//                         fill="currentColor"
//                         d="M1.25 4.85c0-1.26 0-1.89.245-2.371a2.25 2.25 0 0 1 .984-.984c.48-.245 1.11-.245 2.371-.245h6.3c1.26 0 1.89 0 2.371.245.424.216.768.56.984.984.245.48.245 1.11.245 2.371v6.3c0 1.26 0 1.89-.245 2.371-.216.424-.56.768-.984.984-.48.245-1.11.245-2.371.245h-6.3c-1.26 0-1.89 0-2.371-.245a2.25 2.25 0 0 1-.984-.984c-.245-.48-.245-1.11-.245-2.371z"
//                       ></path>
//                     </svg>
//                   </span>
//                   <span className="text-[14px] text-[#68707b]">
//                     New Feature
//                   </span>
//                 </div>
//               </section>
//               <SheetTitle className="text-lg font-semibold text-[#202428] mt-2">
//                 Create New Feature
//               </SheetTitle>
//             </div>

//             {/* Tab Navigation */}
//             <div className="mt-[16px] border-b w-full">
//               <FeatureTab
//                 label="Details"
//                 isActive={activeTab === "details"}
//                 onClick={() => handleTabChange("details")}
//               />
//               <FeatureTab
//                 label="Insights"
//                 isActive={activeTab === "insights"}
//                 onClick={() => handleTabChange("insights")}
//               />
//               <FeatureTab
//                 label="Portal"
//                 isActive={activeTab === "portal"}
//                 onClick={() => handleTabChange("portal")}
//               />
//             </div>
//           </SheetHeader>

//           {/* Tab Content */}
//           <div className="flex-1 overflow-y-auto">
//             {activeTab === "details" && renderDetailsTab()}
//             {activeTab === "insights" && renderInsightsTab()}
//             {activeTab === "portal" && renderPortalTab()}
//           </div>

//           {/* Action Buttons - only show on details tab */}
//           {activeTab === "details" && (
//             <SheetFooter className="flex justify-end gap-2 py-4 mt-4 border-t">
//               <SheetClose asChild>
//                 <Button variant="outline">Cancel</Button>
//               </SheetClose>
//               <Button type="submit">Create Feature</Button>
//             </SheetFooter>
//           )}
//         </form>
//       </SheetContent>
//     </Sheet>
//   );
// }



// // components/CreateFeatureModal.tsx

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// interface CreateFeatureModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   componentId: string | null;
//   onFeatureCreated: (feature: any, componentId: string) => void;
// }

// function FeatureTab({
//   label,
//   isActive,
//   onClick,
// }: {
//   label: string;
//   isActive: boolean;
//   onClick: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`inline-block py-2 px-4 font-medium text-sm ${
//         isActive
//           ? "border-b-2 border-[#2693ff] text-[#2693ff]"
//           : "text-gray-500 hover:text-gray-700"
//       }`}
//     >
//       {label}
//     </button>
//   );
// }

// export function CreateFeatureModal({
//   isOpen,
//   onClose,
//   componentId,
//   onFeatureCreated,
// }: CreateFeatureModalProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     status: "Todo",
//     progress: 0,
//     team: "",
//     days: null,
//     startDate: null,
//     targetDate: null,
//     completedOn: null,
//     remarks: "",
//   });

//   const [activeTab, setActiveTab] = useState("details");
//   const [isCreating, setIsCreating] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value === "" ? null : value,
//     }));
//   };

//   const handleTabChange = (tab: string) => {
//     setActiveTab(tab);
//   };

//   // Calculate progress based on status
//   const calculateProgressFromStatus = (status: string): number => {
//     switch (status) {
//       case "Completed":
//         return 100;
//       case "In Progress":
//         return 50;
//       case "Todo":
//       default:
//         return 0;
//     }
//   };

//   // Update progress when status changes
//   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newStatus = e.target.value;
//     const newProgress = calculateProgressFromStatus(newStatus);
    
//     setFormData(prev => ({
//       ...prev,
//       status: newStatus,
//       progress: newProgress
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsCreating(true);

//     if (!componentId) {
//       console.error("Component ID is null, cannot create feature.");
//       setIsCreating(false);
//       return;
//     }

//     try {
//       // Call the API endpoint instead of direct Supabase access
//       const response = await fetch('/api/features', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           component_id: componentId,
//           // Important: Set this flag to true to trigger component progress update
//           updateComponentProgress: true
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to create feature: ${response.statusText}`);
//       }

//       const feature = await response.json();
      
//       // Call the callback function with the newly created feature
//       onFeatureCreated(feature, componentId);
//       onClose();
      
//       // Reset form data
//       setFormData({
//         name: "",
//         status: "Todo",
//         progress: 0,
//         team: "",
//         days: null,
//         startDate: null,
//         targetDate: null,
//         completedOn: null,
//         remarks: "",
//       });
//     } catch (error) {
//       console.error("Error creating feature:", error);
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const renderDetailsTab = () => (
//     <div className="mt-4 space-y-3">
//       {/* Feature Name */}
//       <div className="space-y-2 mb-4">
//         <Label htmlFor="name" className="text-[#30363c] text-[14px]">Feature Name</Label>
//         <Input
//           id="name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           className="bg-white"
//           required
//         />
//       </div>

//       {/* Status dropdown - positioned at the top */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Status</span>
//         <select
//           id="status"
//           name="status"
//           value={formData.status}
//           onChange={handleStatusChange}
//           className="w-full px-3 h-[32px] border text-[14px] border-gray-300 rounded bg-white"
//         >
//           <option value="Todo">Todo</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Completed">Completed</option>
//           <option value="Blocked">Blocked</option>
//         </select>
//       </div>

//       {/* Progress field (automatically calculated based on status) */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Progress</span>
//         <div className="w-full flex items-center">
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div
//               className="bg-[#68b4ff] h-2.5"
//               style={{ width: `${formData.progress || 0}%` }}
//             ></div>
//           </div>
//           <span className="ml-2">{formData.progress || 0}%</span>
//         </div>
//       </div>

//       {/* Team */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Team</span>
//         <Input
//           id="team"
//           name="team"
//           value={formData.team || ""}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//           placeholder="Assign team"
//         />
//       </div>

//       {/* Days */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Days</span>
//         <Input
//           type="number"
//           id="days"
//           name="days"
//           value={formData.days === null ? "" : formData.days}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//           placeholder="Estimated days"
//         />
//       </div>

//       {/* Start Date */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Start Date</span>
//         <Input
//           type="date"
//           id="startDate"
//           name="startDate"
//           value={formData.startDate === null ? "" : formData.startDate}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//         />
//       </div>

//       {/* Target Date */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Target Date</span>
//         <Input
//           type="date"
//           id="targetDate"
//           name="targetDate"
//           value={formData.targetDate === null ? "" : formData.targetDate}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//         />
//       </div>

//       {/* Completed On */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Completed On</span>
//         <Input
//           type="date"
//           id="completedOn"
//           name="completedOn"
//           value={formData.completedOn === null ? "" : formData.completedOn}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//         />
//       </div>

//       {/* Remarks */}
//       <div className="flex items-center gap-2">
//         <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Remarks</span>
//         <Input
//           id="remarks"
//           name="remarks"
//           value={formData.remarks}
//           onChange={handleChange}
//           className="w-full h-[32px] bg-white"
//           placeholder="Add remarks"
//         />
//       </div>
//     </div>
//   );

//   const renderInsightsTab = () => (
//     <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
//       <img 
//         className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]" 
//         src="/api/placeholder/230/172" 
//         alt="No insights yet"
//       />
//       <section className="flex flex-col items-center justify-center mt-4">
//         <h3 className="text-[#202428] text-[20px] font-bold">No direct insights just yet</h3>
//         <span className="text-[#939da7] text-[12px] font-semibold mt-[4px]">
//           Find relevant insights with search, or start adding insights manually
//         </span>
//       </section>
//     </section>
//   );

//   const renderPortalTab = () => (
//     <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
//       <img 
//         className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]" 
//         src="/api/placeholder/230/172" 
//         alt="Portal features" 
//       />
//       <section className="flex flex-col items-center justify-center mt-4">
//         <h3 className="text-[#202428] text-[20px] font-bold">Validate this idea</h3>
//         <span className="text-[#939da7] text-[12px] font-semibold mt-[4px]">
//           Collect votes and feedback by adding this idea to your portal
//         </span>
//       </section>
//     </section>
//   );

//   return (
//     <Sheet open={isOpen} onOpenChange={onClose}>
//       <SheetContent className="overflow-y-auto">
//         <form onSubmit={handleSubmit} className="h-full flex flex-col">
//           <SheetHeader className="flex flex-col items-start gap-2">
//             <div className="flex flex-col justify-between w-full">
//               <section className="flex gap-2 flex-row justify-between">
//                 <div className="flex flex-row">
//                   <span className="text-[#ffc600] mt-[2px] mr-[8px]">
//                     <svg
//                       height="16px"
//                       width="16px"
//                       viewBox="0 0 16 16"
//                       role="img"
//                       aria-label="FeatureIcon"
//                       className="ui-icon"
//                     >
//                       <path
//                         fill="currentColor"
//                         d="M1.25 4.85c0-1.26 0-1.89.245-2.371a2.25 2.25 0 0 1 .984-.984c.48-.245 1.11-.245 2.371-.245h6.3c1.26 0 1.89 0 2.371.245.424.216.768.56.984.984.245.48.245 1.11.245 2.371v6.3c0 1.26 0 1.89-.245 2.371-.216.424-.56.768-.984.984-.48.245-1.11.245-2.371.245h-6.3c-1.26 0-1.89 0-2.371-.245a2.25 2.25 0 0 1-.984-.984c-.245-.48-.245-1.11-.245-2.371z"
//                       ></path>
//                     </svg>
//                   </span>
//                   <span className="text-[14px] text-[#68707b]">
//                     New Feature
//                   </span>
//                 </div>
//               </section>
//               <SheetTitle className="text-lg font-semibold text-[#202428] mt-2">
//                 Create New Feature
//               </SheetTitle>
//             </div>

//             {/* Tab Navigation */}
//             <div className="mt-[16px] border-b w-full">
//               <FeatureTab
//                 label="Details"
//                 isActive={activeTab === "details"}
//                 onClick={() => handleTabChange("details")}
//               />
//               <FeatureTab
//                 label="Insights"
//                 isActive={activeTab === "insights"}
//                 onClick={() => handleTabChange("insights")}
//               />
//               <FeatureTab
//                 label="Portal"
//                 isActive={activeTab === "portal"}
//                 onClick={() => handleTabChange("portal")}
//               />
//             </div>
//           </SheetHeader>

//           {/* Tab Content */}
//           <div className="flex-1 overflow-y-auto">
//             {activeTab === "details" && renderDetailsTab()}
//             {activeTab === "insights" && renderInsightsTab()}
//             {activeTab === "portal" && renderPortalTab()}
//           </div>

//           {/* Action Buttons - only show on details tab */}
//           {activeTab === "details" && (
//             <SheetFooter className="flex justify-end gap-2 py-4 mt-4 border-t">
//               <SheetClose asChild>
//                 <Button variant="outline" disabled={isCreating}>Cancel</Button>
//               </SheetClose>
//               <Button type="submit" disabled={isCreating}>
//                 {isCreating ? "Creating..." : "Create Feature"}
//               </Button>
//             </SheetFooter>
//           )}
//         </form>
//       </SheetContent>
//     </Sheet>
//   );
// }


// components/CreateFeatureModal.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CreateFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentId: string | null;
  onFeatureCreated: (feature: any, componentId: string) => void;
}

function FeatureTab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-block py-2 px-4 font-medium text-sm ${
        isActive
          ? "border-b-2 border-[#2693ff] text-[#2693ff]"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

export function CreateFeatureModal({
  isOpen,
  onClose,
  componentId,
  onFeatureCreated,
}: CreateFeatureModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    status: "Todo",
    progress: 0,
    team: "",
    days: null,
    startDate: null,
    targetDate: null,
    completedOn: null,
    remarks: "",
  });

  const [activeTab, setActiveTab] = useState("details");
  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Calculate progress based on status
  const calculateProgressFromStatus = (status: string): number => {
    switch (status) {
      case "Completed":
        return 100;
      case "In Progress":
        return 50;
      case "Todo":
      default:
        return 0;
    }
  };

  // Update progress when status changes
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const newProgress = calculateProgressFromStatus(newStatus);
    
    setFormData(prev => ({
      ...prev,
      status: newStatus,
      progress: newProgress
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);

    if (!componentId) {
      console.error("Component ID is null, cannot create feature.");
      setIsCreating(false);
      return;
    }

    try {
      // Make sure we explicitly set the updateComponentProgress flag to true
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          component_id: componentId,
          // Explicitly set to true to ensure component progress is updated
          updateComponentProgress: true
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create feature: ${errorText}`);
      }

      const feature = await response.json();
      
      // Call the callback function with the newly created feature
      onFeatureCreated(feature, componentId);
      onClose();
      
      // Reset form data
      setFormData({
        name: "",
        status: "Todo",
        progress: 0,
        team: "",
        days: null,
        startDate: null,
        targetDate: null,
        completedOn: null,
        remarks: "",
      });
    } catch (error) {
      console.error("Error creating feature:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderDetailsTab = () => (
    <div className="mt-4 space-y-3">
      {/* Feature Name */}
      <div className="space-y-2 mb-4">
        <Label htmlFor="name" className="text-[#30363c] text-[14px]">Feature Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="bg-white"
          required
        />
      </div>

      {/* Status dropdown - positioned at the top */}
      <div className="flex items-center gap-2">
        <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Status</span>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleStatusChange}
          className="w-full px-3 h-[32px] border text-[14px] border-gray-300 rounded bg-white"
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Progress field (automatically calculated based on status) */}
      <div className="flex items-center gap-2">
        <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Progress</span>
        <div className="w-full flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#68b4ff] h-2.5"
              style={{ width: `${formData.progress || 0}%` }}
            ></div>
          </div>
          <span className="ml-2">{formData.progress || 0}%</span>
        </div>
      </div>

      {/* Team */}
      <div className="flex items-center gap-2">
        <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Team</span>
        <Input
          id="team"
          name="team"
          value={formData.team || ""}
          onChange={handleChange}
          className="w-full h-[32px] bg-white"
          placeholder="Assign team"
        />
      </div>

      {/* Days */}
      <div className="flex items-center gap-2">
        <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Days</span>
        <Input
          type="number"
          id="days"
          name="days"
          value={formData.days === null ? "" : formData.days}
          onChange={handleChange}
          className="w-full h-[32px] bg-white"
          placeholder="Estimated days"
        />
      </div>

      {/* Start Date */}
      <div className="flex items-center gap-2">
        <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Start Date</span>
        <Input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate === null ? "" : formData.startDate}
          onChange={handleChange}
          className="w-full h-[32px] bg-white"
        />
      </div>

      {/* Target Date */}
      <div className="flex items-center gap-2">
        <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Target Date</span>
        <Input
          type="date"
          id="targetDate"
          name="targetDate"
          value={formData.targetDate === null ? "" : formData.targetDate}
          onChange={handleChange}
          className="w-full h-[32px] bg-white"
        />
      </div>

      {/* Completed On */}
      <div className="flex items-center gap-2">
        <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Completed On</span>
        <Input
          type="date"
          id="completedOn"
          name="completedOn"
          value={formData.completedOn === null ? "" : formData.completedOn}
          onChange={handleChange}
          className="w-full h-[32px] bg-white"
        />
      </div>

      {/* Remarks */}
      <div className="flex items-center gap-2">
        <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Remarks</span>
        <Input
          id="remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full h-[32px] bg-white"
          placeholder="Add remarks"
        />
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
      <img 
        className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]" 
        src="/api/placeholder/230/172" 
        alt="No insights yet"
      />
      <section className="flex flex-col items-center justify-center mt-4">
        <h3 className="text-[#202428] text-[20px] font-bold">No direct insights just yet</h3>
        <span className="text-[#939da7] text-[12px] font-semibold mt-[4px]">
          Find relevant insights with search, or start adding insights manually
        </span>
      </section>
    </section>
  );

  const renderPortalTab = () => (
    <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
      <img 
        className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]" 
        src="/api/placeholder/230/172" 
        alt="Portal features" 
      />
      <section className="flex flex-col items-center justify-center mt-4">
        <h3 className="text-[#202428] text-[20px] font-bold">Validate this idea</h3>
        <span className="text-[#939da7] text-[12px] font-semibold mt-[4px]">
          Collect votes and feedback by adding this idea to your portal
        </span>
      </section>
    </section>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader className="flex flex-col items-start gap-2">
            <div className="flex flex-col justify-between w-full">
              <section className="flex gap-2 flex-row justify-between">
                <div className="flex flex-row">
                  <span className="text-[#ffc600] mt-[2px] mr-[8px]">
                    <svg
                      height="16px"
                      width="16px"
                      viewBox="0 0 16 16"
                      role="img"
                      aria-label="FeatureIcon"
                      className="ui-icon"
                    >
                      <path
                        fill="currentColor"
                        d="M1.25 4.85c0-1.26 0-1.89.245-2.371a2.25 2.25 0 0 1 .984-.984c.48-.245 1.11-.245 2.371-.245h6.3c1.26 0 1.89 0 2.371.245.424.216.768.56.984.984.245.48.245 1.11.245 2.371v6.3c0 1.26 0 1.89-.245 2.371-.216.424-.56.768-.984.984-.48.245-1.11.245-2.371.245h-6.3c-1.26 0-1.89 0-2.371-.245a2.25 2.25 0 0 1-.984-.984c-.245-.48-.245-1.11-.245-2.371z"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-[14px] text-[#68707b]">
                    New Feature
                  </span>
                </div>
              </section>
              <SheetTitle className="text-lg font-semibold text-[#202428] mt-2">
                Create New Feature
              </SheetTitle>
            </div>

            {/* Tab Navigation */}
            <div className="mt-[16px] border-b w-full">
              <FeatureTab
                label="Details"
                isActive={activeTab === "details"}
                onClick={() => handleTabChange("details")}
              />
              <FeatureTab
                label="Insights"
                isActive={activeTab === "insights"}
                onClick={() => handleTabChange("insights")}
              />
              <FeatureTab
                label="Portal"
                isActive={activeTab === "portal"}
                onClick={() => handleTabChange("portal")}
              />
            </div>
          </SheetHeader>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "details" && renderDetailsTab()}
            {activeTab === "insights" && renderInsightsTab()}
            {activeTab === "portal" && renderPortalTab()}
          </div>

          {/* Action Buttons - only show on details tab */}
          {activeTab === "details" && (
            <SheetFooter className="flex justify-end gap-2 py-4 mt-4 border-t">
              <SheetClose asChild>
                <Button variant="outline" disabled={isCreating}>Cancel</Button>
              </SheetClose>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Feature"}
              </Button>
            </SheetFooter>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}