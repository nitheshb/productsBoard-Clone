

// // 'use client';

// // import React, { useEffect, useState, useRef } from 'react';
// // import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// // import { Button } from '@/components/ui/button';
// // import { Trash2, MoreVertical } from 'lucide-react';
// // import { Feature } from '@/app/types'; // Assuming this type exists
// // import { Input } from '@/components/ui/input';
// // import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// // // Enum for status
// // enum Status {
// //   TODO = 'Todo',
// //   IN_PROGRESS = 'In Progress',
// //   COMPLETED = 'Completed'
// // }

// // interface FeatureDetailsPageProps {
// //   featureId: string;
// //   isOpen: boolean;
// //   onClose: () => void;
// // }

// // function FeatureDetailsTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       className={`inline-block py-2 px-4 font-medium text-sm ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
// //     >
// //       {label}
// //     </button>
// //   );
// // }

// // function DetailsTabContent({ feature, draftFeature, editingField, editInputRef, handleFieldHover, handleInputChange, handleInputBlur, handleInputKeyPress, handleStatusChange }: {
// //   feature: Feature;
// //   draftFeature: Feature;
// //   editingField: keyof Feature | null;
// //   editInputRef: React.RefObject<HTMLInputElement>;
// //   handleFieldHover: (field: keyof Feature) => void;
// //   handleInputChange: (field: keyof Feature, value: any) => void;
// //   handleInputBlur: (field: keyof Feature) => Promise<void>;
// //   handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => Promise<void>;
// //   handleStatusChange: (featureId: string, newStatus: Status) => Promise<void>;
// // }) {
// //   return (
// //     <div className="mt-4 space-y-3">
// //       {/* Status dropdown - positioned at the top */}
// //       <div className="flex items-center gap-2">
// //         <span className="text-gray-500 w-32 capitalize">Status</span>
// //         <select
// //           value={draftFeature?.status || feature?.status || Status.TODO}
// //           onChange={(e) => handleStatusChange(feature.id, e.target.value as Status)}
// //           className="w-full py-2 px-3 border border-gray-300 rounded"
// //         >
// //           {Object.values(Status).map(status => (
// //             <option key={status} value={status}>{status}</option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* Filter out status field since we're handling it separately above */}
// //       {(Object.keys(feature || {}) as (keyof Feature)[])
// //         .filter(key => key !== 'id' && key !== 'name' && key !== 'created_at' && key !== 'status')
// //         .map((key) => (
// //           <div key={key} className="flex items-center gap-2">
// //             <span className="text-gray-500 w-32 capitalize">{key.replace(/_/g, ' ')}</span>
// //             <div
// //               className="relative w-full"
// //               onMouseEnter={() => handleFieldHover(key)}
// //               onMouseLeave={() => editingField === key && editInputRef.current !== document.activeElement && handleInputBlur(key)}
// //             >
// //               {editingField === key ? (
// //                 <Input
// //                   ref={editInputRef}
// //                   type="text" // Adjust type based on the field
// //                   value={draftFeature[key] !== null && draftFeature[key] !== undefined ? String(draftFeature[key]) : ''}
// //                   onChange={(e) => handleInputChange(key, e.target.value)}
// //                   onBlur={() => handleInputBlur(key)}
// //                   onKeyDown={(e) => handleInputKeyPress(e, key)}
// //                   className="w-full"
// //                 />
// //               ) : (
// //                 <span>{feature[key] !== null && feature[key] !== undefined ? String(feature[key]) : 'Not assigned'}</span>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //     </div>
// //   );
// // }

// // function InsightsTabContent() {
// //   return <div>Content for Insights tab</div>;
// // }

// // function PortalTabContent() {
// //   return <div>Content for Portal tab</div>;
// // }

// // export function FeatureDetailsPage({ featureId, isOpen, onClose }: FeatureDetailsPageProps) {
// //   const [feature, setFeature] = useState<Feature | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [editingField, setEditingField] = useState<keyof Feature | null>(null);
// //   const [draftFeature, setDraftFeature] = useState<Feature | null>(null);
// //   const editInputRef = useRef<HTMLInputElement>(null);
// //   const [activeTab, setActiveTab] = useState('details');

// //   useEffect(() => {
// //     if (isOpen && featureId) {
// //       const fetchFeatureDetails = async () => {
// //         setLoading(true);
// //         setError(null);
// //         try {
// //           const response = await fetch(`/api/features/${featureId}`);

// //           if (!response.ok) {
// //             const errorText = await response.text();
// //             let errorMessage;
// //             try {
// //               const errorData = JSON.parse(errorText);
// //               errorMessage = errorData?.error || `Failed to fetch feature (status ${response.status})`;
// //             } catch (parseError) {
// //               errorMessage = `Failed to fetch feature (status ${response.status}): ${errorText.substring(0, 100)}`;
// //             }
// //             throw new Error(errorMessage);
// //           }

// //           const data: Feature = await response.json();
// //           setFeature(data);
// //           setDraftFeature({ ...data });
// //         } catch (err: any) {
// //           console.error('Error fetching feature details:', err);
// //           setError(err.message);
// //         } finally {
// //           setLoading(false);
// //         }
// //       };
// //       fetchFeatureDetails();
// //     } else {
// //       setFeature(null);
// //       setDraftFeature(null);
// //       setEditingField(null);
// //       setActiveTab('details');
// //     }
// //   }, [isOpen, featureId]);

// //   useEffect(() => {
// //     if (editingField && editInputRef.current) {
// //       editInputRef.current.focus();
// //     }
// //   }, [editingField]);

// //   const handleFieldHover = (field: keyof Feature) => {
// //     setEditingField(field);
// //   };

// //   const handleInputChange = (field: keyof Feature, value: any) => {
// //     setDraftFeature(prev => prev ? { ...prev, [field]: value } : null);
// //   };

// //   const handleInputBlur = async (field: keyof Feature) => {
// //     if (editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
// //       await saveChanges();
// //     }
// //     setEditingField(null);
// //   };

// //   const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => {
// //     if (event.key === 'Enter' && editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
// //       await saveChanges();
// //       setEditingField(null);
// //     } else if (event.key === 'Escape') {
// //       setDraftFeature(feature ? { ...feature, id: feature.id || '' } : null); // Revert changes
// //       setEditingField(null);
// //     }
// //   };

// //   const saveChanges = async () => {
// //     if (!draftFeature || !featureId) return;
// //     setFeature(draftFeature); 
// //     try {
// //       const response = await fetch(`/api/features/${featureId}`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(draftFeature),
// //       });
// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData?.error || `Failed to update feature`);
// //       }
// //       const data: Feature = await response.json();
// //       setFeature(data);
// //       setDraftFeature(data);
// //       // Removed toast here
// //       console.log("Feature updated successfully");
// //     } catch (error) {
// //       console.error('Error updating feature:', error);
// //       // Removed toast here
// //       setDraftFeature(feature);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (!featureId) return;
// //     if (window.confirm('Are you sure you want to delete this feature?')) {
// //       try {
// //         const response = await fetch(`/api/features/${featureId}`, {
// //           method: 'DELETE',
// //         });
// //         if (!response.ok) {
// //           const errorData = await response.json();
// //           throw new Error(errorData?.error || `Failed to delete feature`);
// //         }
// //         // Removed toast here
// //         console.log("Feature deleted successfully");
// //         onClose();
// //       } catch (error) {
// //         console.error('Error deleting feature:', error);
// //         // Removed toast here
// //       }
// //     }
// //   };

// //   const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
// //     setActiveTab(tab);
// //   };

  

// //   const handleStatusChange = async (featureId: string, newStatus: string) => {
// //     try {
// //         const response = await fetch(`/api/features/${featureId}`, {
// //             method: 'PUT',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ status: newStatus }),
// //         });

// //         const updatedFeature = await response.json();

// //         if (updatedFeature.error) {
// //             console.error('Error updating feature:', updatedFeature.error);
// //         } else {
// //             console.log('Feature status updated successfully:', updatedFeature);
// //         }
// //     } catch (error) {
// //         console.error('Error updating feature status:', error);
// //     }
// // };


// //   if (loading) return <div>Loading...</div>;
// //   if (error) return <div>Error: {error}</div>;
// //   if (!feature || !draftFeature) return <div>No feature found</div>;

// //   return (
// //     <div className="p-6">
// //       <Sheet open={isOpen} onOpenChange={onClose}>
// //         <SheetContent className="sm:max-w-md overflow-y-auto">
// //           <SheetHeader className="flex flex-col items-start gap-2">
// //             <div className="flex items-center justify-between w-full">
// //               <div
// //                 className="relative w-full"
// //                 onMouseEnter={() => handleFieldHover('name')}
// //                 onMouseLeave={() => editingField === 'name' && editInputRef.current !== document.activeElement && handleInputBlur('name')}
// //               >
// //                 {editingField === 'name' ? (
// //                   <Input
// //                     ref={editInputRef}
// //                     type="text"
// //                     value={draftFeature.name || ''}
// //                     onChange={(e) => handleInputChange('name', e.target.value)}
// //                     onBlur={() => handleInputBlur('name')}
// //                     onKeyDown={(e) => handleInputKeyPress(e, 'name')}
// //                     className="w-full text-lg font-semibold"
// //                   />
// //                 ) : (
// //                   <SheetTitle className="text-lg font-semibold">{feature.name}</SheetTitle>
// //                 )}
// //               </div>
// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <Button variant="ghost" className="h-8 w-8 p-0">
// //                     <MoreVertical className="h-4 w-4" />
// //                   </Button>
// //                 </DropdownMenuTrigger>
// //                 <DropdownMenuContent align="end" sideOffset={4}>
// //                   <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:bg-red-100">
// //                     <Trash2 className="mr-2 h-4 w-4" />
// //                     Delete feature
// //                   </DropdownMenuItem>
// //                 </DropdownMenuContent>
// //               </DropdownMenu>
// //             </div>

// //             {/* Tab Navigation */}
// //             <div className="mt-2 border-b">
// //               <FeatureDetailsTab
// //                 label="Details"
// //                 isActive={activeTab === 'details'}
// //                 onClick={() => handleTabChange('details')}
// //               />
// //               <FeatureDetailsTab
// //                 label="Insights"
// //                 isActive={activeTab === 'insights'}
// //                 onClick={() => handleTabChange('insights')}
// //               />
// //               <FeatureDetailsTab
// //                 label="Portal"
// //                 isActive={activeTab === 'portal'}
// //                 onClick={() => handleTabChange('portal')}
// //               />
// //             </div>
// //           </SheetHeader>

// //           {/* Tab Content */}
// //           {activeTab === 'details' && (
// //             <DetailsTabContent
// //               feature={feature}
// //               draftFeature={draftFeature}
// //               editingField={editingField}
// //               editInputRef={editInputRef}
// //               handleFieldHover={handleFieldHover}
// //               handleInputChange={handleInputChange}
// //               handleInputBlur={handleInputBlur}
// //               handleInputKeyPress={handleInputKeyPress}
// //               handleStatusChange={handleStatusChange}
// //             />
// //           )}
// //           {activeTab === 'insights' && <InsightsTabContent />}
// //           {activeTab === 'portal' && <PortalTabContent />}
// //         </SheetContent>
// //       </Sheet>
// //     </div>
// //   );
// // }

// // export default FeatureDetailsPage;





// // // // 'use client';

// // // // import React, { useEffect, useState, useRef } from 'react';
// // // // import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Trash2, MoreVertical } from 'lucide-react';
// // // // import { Feature } from '@/app/types'; // Assuming this type exists
// // // // import { Input } from '@/components/ui/input';
// // // // import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// // // // // Enum for status
// // // // enum Status {
// // // //   TODO = 'Todo',
// // // //   IN_PROGRESS = 'In Progress',
// // // //   COMPLETED = 'Completed'
// // // // }

// // // // interface FeatureDetailsPageProps {
// // // //   featureId: string;
// // // //   isOpen: boolean;
// // // //   onClose: () => void;
// // // // }

// // // // function FeatureDetailsTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
// // // //   return (
// // // //     <button
// // // //       onClick={onClick}
// // // //       className={`inline-block py-2 px-4 font-medium text-sm ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
// // // //     >
// // // //       {label}
// // // //     </button>
// // // //   );
// // // // }

// // // // function DetailsTabContent({ feature, draftFeature, editingField, editInputRef, handleFieldHover, handleInputChange, handleInputBlur, handleInputKeyPress, handleStatusChange }: {
// // // //   feature: Feature;
// // // //   draftFeature: Feature;
// // // //   editingField: keyof Feature | null;
// // // //   editInputRef: React.RefObject<HTMLInputElement>;
// // // //   handleFieldHover: (field: keyof Feature) => void;
// // // //   handleInputChange: (field: keyof Feature, value: any) => void;
// // // //   handleInputBlur: (field: keyof Feature) => Promise<void>;
// // // //   handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => Promise<void>;
// // // //   handleStatusChange: (featureId: string, newStatus: Status) => Promise<void>;
// // // // }) {
// // // //   return (
// // // //     <div className="mt-4 space-y-3">
// // // //       {/* Status dropdown - positioned at the top */}
// // // //       <div className="flex items-center gap-2">
// // // //         <span className="text-gray-500 w-32 capitalize">Status</span>
// // // //         <select
// // // //           value={draftFeature?.status || feature?.status || Status.TODO}
// // // //           onChange={(e) => handleStatusChange(feature.id, e.target.value as Status)}
// // // //           className="w-full py-2 px-3 border border-gray-300 rounded"
// // // //         >
// // // //           {Object.values(Status).map(status => (
// // // //             <option key={status} value={status}>{status}</option>
// // // //           ))}
// // // //         </select>
// // // //       </div>

// // // //       {/* Filter out status field since we're handling it separately above */}
// // // //       {(Object.keys(feature || {}) as (keyof Feature)[])
// // // //         .filter(key => key !== 'id' && key !== 'name' && key !== 'created_at' && key !== 'status')
// // // //         .map((key) => (
// // // //           <div key={key} className="flex items-center gap-2">
// // // //             <span className="text-gray-500 w-32 capitalize">{key.replace(/_/g, ' ')}</span>
// // // //             <div
// // // //               className="relative w-full"
// // // //               onMouseEnter={() => handleFieldHover(key)}
// // // //               onMouseLeave={() => editingField === key && editInputRef.current !== document.activeElement && handleInputBlur(key)}
// // // //             >
// // // //               {editingField === key ? (
// // // //                 <Input
// // // //                   ref={editInputRef}
// // // //                   type="text" // Adjust type based on the field
// // // //                   value={draftFeature[key] !== null && draftFeature[key] !== undefined ? String(draftFeature[key]) : ''}
// // // //                   onChange={(e) => handleInputChange(key, e.target.value)}
// // // //                   onBlur={() => handleInputBlur(key)}
// // // //                   onKeyDown={(e) => handleInputKeyPress(e, key)}
// // // //                   className="w-full"
// // // //                 />
// // // //               ) : (
// // // //                 <span>{feature[key] !== null && feature[key] !== undefined ? String(feature[key]) : 'Not assigned'}</span>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //     </div>
// // // //   );
// // // // }

// // // // function InsightsTabContent() {
// // // //   return <div>Content for Insights tab</div>;
// // // // }

// // // // function PortalTabContent() {
// // // //   return <div>Content for Portal tab</div>;
// // // // }

// // // // export function FeatureDetailsPage({ featureId, isOpen, onClose }: FeatureDetailsPageProps) {
// // // //   const [feature, setFeature] = useState<Feature | null>(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState<string | null>(null);
// // // //   const [editingField, setEditingField] = useState<keyof Feature | null>(null);
// // // //   const [draftFeature, setDraftFeature] = useState<Feature | null>(null);
// // // //   const editInputRef = useRef<HTMLInputElement>(null);
// // // //   const [activeTab, setActiveTab] = useState('details');

// // // //   useEffect(() => {
// // // //     if (isOpen && featureId) {
// // // //       const fetchFeatureDetails = async () => {
// // // //         // setLoading(true);
// // // //         // setError(null);
// // // //         try {
// // // //           const response = await fetch(`/api/features/${featureId}`);

// // // //           if (!response.ok) {
// // // //             const errorText = await response.text();
// // // //             let errorMessage;
// // // //             try {
// // // //               const errorData = JSON.parse(errorText);
// // // //               errorMessage = errorData?.error || `Failed to fetch feature (status ${response.status})`;
// // // //             } catch (parseError) {
// // // //               errorMessage = `Failed to fetch feature (status ${response.status}): ${errorText.substring(0, 100)}`;
// // // //             }
// // // //             throw new Error(errorMessage);
// // // //           }

// // // //           const data: Feature = await response.json();
// // // //           setFeature(data);
// // // //           setDraftFeature({ ...data });
// // // //         } catch (err: any) {
// // // //           console.error('Error fetching feature details:', err);
// // // //           setError(err.message);
// // // //         } finally {
// // // //           setLoading(false);
// // // //         }
// // // //       };
// // // //       fetchFeatureDetails();
// // // //     } else {
// // // //       setFeature(null);
// // // //       setDraftFeature(null);
// // // //       setEditingField(null);
// // // //       setActiveTab('details');
// // // //     }
// // // //   }, [isOpen, featureId]);

// // // //   useEffect(() => {
// // // //     if (editingField && editInputRef.current) {
// // // //       editInputRef.current.focus();
// // // //     }
// // // //   }, [editingField]);

// // // //   const handleFieldHover = (field: keyof Feature) => {
// // // //     setEditingField(field);
// // // //   };

// // // //   const handleInputChange = (field: keyof Feature, value: any) => {
// // // //     setDraftFeature(prev => prev ? { ...prev, [field]: value } : null);
// // // //   };

// // // //   const handleInputBlur = async (field: keyof Feature) => {
// // // //     if (editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
// // // //       await saveChanges();
// // // //     }
// // // //     setEditingField(null);
// // // //   };

// // // //   const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => {
// // // //     if (event.key === 'Enter' && editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
// // // //       await saveChanges();
// // // //       setEditingField(null);
// // // //     } else if (event.key === 'Escape') {
// // // //       setDraftFeature(feature ? { ...feature, id: feature.id || '' } : null); // Revert changes
// // // //       setEditingField(null);
// // // //     }
// // // //   };

// // // //   const saveChanges = async () => {
// // // //     if (!draftFeature || !featureId) return;
// // // //     setFeature(draftFeature); 
// // // //     try {
// // // //       const response = await fetch(`/api/features/${featureId}`, {
// // // //         method: 'PUT',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify(draftFeature),
// // // //       });
// // // //       if (!response.ok) {
// // // //         const errorData = await response.json();
// // // //         throw new Error(errorData?.error || `Failed to update feature`);
// // // //       }
// // // //       const data: Feature = await response.json();
// // // //       setFeature(data);
// // // //       setDraftFeature(data);
// // // //       // Removed toast here
// // // //       console.log("Feature updated successfully");
// // // //     } catch (error) {
// // // //       console.error('Error updating feature:', error);
// // // //       // Removed toast here
// // // //       setDraftFeature(feature);
// // // //     }
// // // //   };

// // // //   const handleDelete = async () => {
// // // //     if (!featureId) return;
// // // //     if (window.confirm('Are you sure you want to delete this feature?')) {
// // // //       try {
// // // //         const response = await fetch(`/api/features/${featureId}`, {
// // // //           method: 'DELETE',
// // // //         });
// // // //         if (!response.ok) {
// // // //           const errorData = await response.json();
// // // //           throw new Error(errorData?.error || `Failed to delete feature`);
// // // //         }
// // // //         // Removed toast here
// // // //         console.log("Feature deleted successfully");
// // // //         onClose();
// // // //       } catch (error) {
// // // //         console.error('Error deleting feature:', error);
// // // //         // Removed toast here
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
// // // //     setActiveTab(tab);
// // // //   };

  

// // // //   const handleStatusChange = async (featureId: string, newStatus: string) => {
// // // //     try {
// // // //         const response = await fetch(`/api/features/${featureId}`, {
// // // //             method: 'PUT',
// // // //             headers: { 'Content-Type': 'application/json' },
// // // //             body: JSON.stringify({ status: newStatus }),
// // // //         });

// // // //         const updatedFeature = await response.json();

// // // //         if (updatedFeature.error) {
// // // //             console.error('Error updating feature:', updatedFeature.error);
// // // //         } else {
// // // //             console.log('Feature status updated successfully:', updatedFeature);
// // // //         }
// // // //     } catch (error) {
// // // //         console.error('Error updating feature status:', error);
// // // //     }
// // // // };


// // // //   if (loading) return <div>Loading...</div>;
// // // //   if (error) return <div>Error: {error}</div>;
// // // //   if (!feature || !draftFeature) return <div>No feature found</div>;

// // // //   return (
// // // //     <div className="p-6">
// // // //       <Sheet open={isOpen} onOpenChange={onClose}>
// // // //         <SheetContent className="sm:max-w-md overflow-y-auto">
// // // //           <SheetHeader className="flex flex-col items-start gap-2">
// // // //             <div className="flex items-center justify-between w-full">
// // // //               <div
// // // //                 className="relative w-full"
// // // //                 onMouseEnter={() => handleFieldHover('name')}
// // // //                 onMouseLeave={() => editingField === 'name' && editInputRef.current !== document.activeElement && handleInputBlur('name')}
// // // //               >
// // // //                 {editingField === 'name' ? (
// // // //                   <Input
// // // //                     ref={editInputRef}
// // // //                     type="text"
// // // //                     value={draftFeature.name || ''}
// // // //                     onChange={(e) => handleInputChange('name', e.target.value)}
// // // //                     onBlur={() => handleInputBlur('name')}
// // // //                     onKeyDown={(e) => handleInputKeyPress(e, 'name')}
// // // //                     className="w-full text-lg font-semibold"
// // // //                   />
// // // //                 ) : (
// // // //                   <SheetTitle className="text-lg font-semibold">{feature.name}</SheetTitle>
// // // //                 )}
// // // //               </div>
// // // //               <DropdownMenu>
// // // //                 <DropdownMenuTrigger asChild>
// // // //                   <Button variant="ghost" className="h-8 w-8 p-0">
// // // //                     <MoreVertical className="h-4 w-4" />
// // // //                   </Button>
// // // //                 </DropdownMenuTrigger>
// // // //                 <DropdownMenuContent align="end" sideOffset={4}>
// // // //                   <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:bg-red-100">
// // // //                     <Trash2 className="mr-2 h-4 w-4" />
// // // //                     Delete feature
// // // //                   </DropdownMenuItem>
// // // //                 </DropdownMenuContent>
// // // //               </DropdownMenu>
// // // //             </div>

// // // //             {/* Tab Navigation */}
// // // //             <div className="mt-2 border-b">
// // // //               <FeatureDetailsTab
// // // //                 label="Details"
// // // //                 isActive={activeTab === 'details'}
// // // //                 onClick={() => handleTabChange('details')}
// // // //               />
// // // //               <FeatureDetailsTab
// // // //                 label="Insights"
// // // //                 isActive={activeTab === 'insights'}
// // // //                 onClick={() => handleTabChange('insights')}
// // // //               />
// // // //               <FeatureDetailsTab
// // // //                 label="Portal"
// // // //                 isActive={activeTab === 'portal'}
// // // //                 onClick={() => handleTabChange('portal')}
// // // //               />
// // // //             </div>
// // // //           </SheetHeader>

// // // //           {/* Tab Content */}
// // // //           {activeTab === 'details' && (
// // // //             <DetailsTabContent
// // // //               feature={feature}
// // // //               draftFeature={draftFeature}
// // // //               editingField={editingField}
// // // //               editInputRef={editInputRef}
// // // //               handleFieldHover={handleFieldHover}
// // // //               handleInputChange={handleInputChange}
// // // //               handleInputBlur={handleInputBlur}
// // // //               handleInputKeyPress={handleInputKeyPress}
// // // //               handleStatusChange={handleStatusChange}
// // // //             />
// // // //           )}
// // // //           {activeTab === 'insights' && <InsightsTabContent />}
// // // //           {activeTab === 'portal' && <PortalTabContent />}
// // // //         </SheetContent>
// // // //       </Sheet>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default FeatureDetailsPage;


// // // 'use client';

// // // import React, { useEffect, useState, useRef } from 'react';
// // // import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// // // import { Button } from '@/components/ui/button';
// // // import { Trash2, MoreVertical } from 'lucide-react';
// // // import { Feature } from '@/app/types'; // Assuming this type exists
// // // import { Input } from '@/components/ui/input';
// // // import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// // // // Enum for status
// // // enum Status {
// // //   TODO = 'Todo',
// // //   IN_PROGRESS = 'In Progress',
// // //   COMPLETED = 'Completed'
// // // }

// // // interface FeatureDetailsPageProps {
// // //   featureId: string;
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // // }

// // // function FeatureDetailsTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
// // //   return (
// // //     <button
// // //       onClick={onClick}
// // //       className={`inline-block py-2 px-4 font-medium text-sm ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
// // //     >
// // //       {label}
// // //     </button>
// // //   );
// // // }

// // // function DetailsTabContent({ feature, draftFeature, editingField, editInputRef, handleFieldHover, handleInputChange, handleInputBlur, handleInputKeyPress, handleStatusChange }: {
// // //   feature: Feature;
// // //   draftFeature: Feature;
// // //   editingField: keyof Feature | null;
// // //   editInputRef: React.RefObject<HTMLInputElement>;
// // //   handleFieldHover: (field: keyof Feature) => void;
// // //   handleInputChange: (field: keyof Feature, value: any) => void;
// // //   handleInputBlur: (field: keyof Feature) => Promise<void>;
// // //   handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => Promise<void>;
// // //   handleStatusChange: (featureId: string, newStatus: Status) => Promise<void>;
// // // }) {
// // //   return (
// // //     <div className="mt-4 space-y-3">
// // //       {/* Status dropdown - positioned at the top */}
// // //       <div className="flex items-center gap-2">
// // //         <span className="text-gray-500 w-32 capitalize">Status</span>
// // //         <select
// // //           value={draftFeature?.status || feature?.status || Status.TODO}
// // //           onChange={(e) => handleStatusChange(feature.id, e.target.value as Status)}
// // //           className="w-full py-2 px-3 border border-gray-300 rounded"
// // //         >
// // //           {Object.values(Status).map(status => (
// // //             <option key={status} value={status}>{status}</option>
// // //           ))}
// // //         </select>
// // //       </div>

// // //       {/* Filter out status field since we're handling it separately above */}
// // //       {(Object.keys(feature || {}) as (keyof Feature)[])
// // //         .filter(key => key !== 'id' && key !== 'name' && key !== 'created_at' && key !== 'status')
// // //         .map((key) => (
// // //           <div key={key} className="flex items-center gap-2">
// // //             <span className="text-gray-500 w-32 capitalize">{key.replace(/_/g, ' ')}</span>
// // //             <div
// // //               className="relative w-full"
// // //               onMouseEnter={() => handleFieldHover(key)}
// // //               onMouseLeave={() => editingField === key && editInputRef.current !== document.activeElement && handleInputBlur(key)}
// // //             >
// // //               {editingField === key ? (
// // //                 <Input
// // //                   ref={editInputRef}
// // //                   type="text" // Adjust type based on the field
// // //                   value={draftFeature[key] !== null && draftFeature[key] !== undefined ? String(draftFeature[key]) : ''}
// // //                   onChange={(e) => handleInputChange(key, e.target.value)}
// // //                   onBlur={() => handleInputBlur(key)}
// // //                   onKeyDown={(e) => handleInputKeyPress(e, key)}
// // //                   className="w-full"
// // //                 />
// // //               ) : (
// // //                 <span>{feature[key] !== null && feature[key] !== undefined ? String(feature[key]) : 'Not assigned'}</span>
// // //               )}
// // //             </div>
// // //           </div>
// // //         ))}
// // //     </div>
// // //   );
// // // }

// // // function InsightsTabContent() {
// // //   return <div>Content for Insights tab</div>;
// // // }

// // // function PortalTabContent() {
// // //   return <div>Content for Portal tab</div>;
// // // }

// // // export function FeatureDetailsPage({ featureId, isOpen, onClose }: FeatureDetailsPageProps) {
// // //   const [feature, setFeature] = useState<Feature | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [editingField, setEditingField] = useState<keyof Feature | null>(null);
// // //   const [draftFeature, setDraftFeature] = useState<Feature | null>(null);
// // //   const editInputRef = useRef<HTMLInputElement>(null);
// // //   const [activeTab, setActiveTab] = useState('details');

// // //   useEffect(() => {
// // //     if (isOpen && featureId) {
// // //       const fetchFeatureDetails = async () => {
// // //         setLoading(true);
// // //         setError(null);
// // //         try {
// // //           const response = await fetch(`/api/features/${featureId}`);

// // //           if (!response.ok) {
// // //             const errorText = await response.text();
// // //             let errorMessage;
// // //             try {
// // //               const errorData = JSON.parse(errorText);
// // //               errorMessage = errorData?.error || `Failed to fetch feature (status ${response.status})`;
// // //             } catch (parseError) {
// // //               errorMessage = `Failed to fetch feature (status ${response.status}): ${errorText.substring(0, 100)}`;
// // //             }
// // //             throw new Error(errorMessage);
// // //           }

// // //           const data: Feature = await response.json();
// // //           setFeature(data);
// // //           setDraftFeature({ ...data });
// // //         } catch (err: any) {
// // //           console.error('Error fetching feature details:', err);
// // //           setError(err.message);
// // //         } finally {
// // //           setLoading(false);
// // //         }
// // //       };
// // //       fetchFeatureDetails();
// // //     } else {
// // //       setFeature(null);
// // //       setDraftFeature(null);
// // //       setEditingField(null);
// // //       setActiveTab('details');
// // //     }
// // //   }, [isOpen, featureId]);

// // //   useEffect(() => {
// // //     // Ensure feature reflects draftFeature immediately after it's updated
// // //     if (draftFeature && draftFeature !== feature) {
// // //       setFeature(draftFeature);  // Update feature state immediately after draftFeature changes
// // //     }
// // //   }, [draftFeature]);

// // //   useEffect(() => {
// // //     if (editingField && editInputRef.current) {
// // //       editInputRef.current.focus();
// // //     }
// // //   }, [editingField]);

// // //   const handleFieldHover = (field: keyof Feature) => {
// // //     setEditingField(field);
// // //   };

// // //   const handleInputChange = (field: keyof Feature, value: any) => {
// // //     setDraftFeature(prev => prev ? { ...prev, [field]: value } : null);
// // //   };

// // //   const handleInputBlur = async (field: keyof Feature) => {
// // //     if (editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
// // //       await saveChanges();
// // //     }
// // //     setEditingField(null);
// // //   };

// // //   const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => {
// // //     if (event.key === 'Enter' && editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
// // //       await saveChanges();
// // //       setEditingField(null);
// // //     } else if (event.key === 'Escape') {
// // //       setDraftFeature(feature ? { ...feature, id: feature.id || '' } : null); // Revert changes
// // //       setEditingField(null);
// // //     }
// // //   };

// // //   const saveChanges = async () => {
// // //     if (!draftFeature || !featureId) return;
// // //     try {
// // //       const response = await fetch(`/api/features/${featureId}`, {
// // //         method: 'PUT',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify(draftFeature),
// // //       });
// // //       if (!response.ok) {
// // //         const errorData = await response.json();
// // //         throw new Error(errorData?.error || `Failed to update feature`);
// // //       }
// // //       const data: Feature = await response.json();
// // //       setFeature(data);
// // //       setDraftFeature(data);  // Update draftFeature immediately after save
// // //       console.log("Feature updated successfully");
// // //     } catch (error) {
// // //       console.error('Error updating feature:', error);
// // //       setDraftFeature(feature);  // Revert draftFeature to original if error occurs
// // //     }
// // //   };

// // //   const handleDelete = async () => {
// // //     if (!featureId) return;
// // //     if (window.confirm('Are you sure you want to delete this feature?')) {
// // //       try {
// // //         const response = await fetch(`/api/features/${featureId}`, {
// // //           method: 'DELETE',
// // //         });
// // //         if (!response.ok) {
// // //           const errorData = await response.json();
// // //           throw new Error(errorData?.error || `Failed to delete feature`);
// // //         }
// // //         console.log("Feature deleted successfully");
// // //         onClose();
// // //       } catch (error) {
// // //         console.error('Error deleting feature:', error);
// // //       }
// // //     }
// // //   };

// // //   const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
// // //     setActiveTab(tab);
// // //   };

// // //   const handleStatusChange = async (featureId: string, newStatus: string) => {
// // //     try {
// // //         const response = await fetch(`/api/features/${featureId}`, {
// // //             method: 'PUT',
// // //             headers: { 'Content-Type': 'application/json' },
// // //             body: JSON.stringify({ status: newStatus }),
// // //         });

// // //         const updatedFeature = await response.json();

// // //         if (updatedFeature.error) {
// // //             console.error('Error updating feature:', updatedFeature.error);
// // //         } else {
// // //             console.log('Feature status updated successfully:', updatedFeature);
// // //         }
// // //     } catch (error) {
// // //         console.error('Error updating feature status:', error);
// // //     }
// // // };

// // //   if (loading) return <div>Loading...</div>;
// // //   if (error) return <div>Error: {error}</div>;
// // //   if (!feature || !draftFeature) return <div>No feature found</div>;

// // //   return (
// // //     <div className="p-6">
// // //       <Sheet open={isOpen} onOpenChange={onClose}>
// // //         <SheetContent className="sm:max-w-md overflow-y-auto">
// // //           <SheetHeader className="flex flex-col items-start gap-2">
// // //             <div className="flex items-center justify-between w-full">
// // //               <div
// // //                 className="relative w-full"
// // //                 onMouseEnter={() => handleFieldHover('name')}
// // //                 onMouseLeave={() => editingField === 'name' && editInputRef.current !== document.activeElement && handleInputBlur('name')}
// // //               >
// // //                 {editingField === 'name' ? (
// // //                   <Input
// // //                     ref={editInputRef}
// // //                     type="text"
// // //                     value={draftFeature.name || ''}
// // //                     onChange={(e) => handleInputChange('name', e.target.value)}
// // //                     onBlur={() => handleInputBlur('name')}
// // //                     onKeyDown={(e) => handleInputKeyPress(e, 'name')}
// // //                     className="w-full text-lg font-semibold"
// // //                   />
// // //                 ) : (
// // //                   <SheetTitle className="text-lg font-semibold">{feature.name}</SheetTitle>
// // //                 )}
// // //               </div>
// // //               <DropdownMenu>
// // //                 <DropdownMenuTrigger asChild>
// // //                   <Button variant="ghost" className="h-8 w-8 p-0">
// // //                     <MoreVertical className="h-4 w-4" />
// // //                   </Button>
// // //                 </DropdownMenuTrigger>
// // //                 <DropdownMenuContent align="end" sideOffset={4}>
// // //                   <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:bg-red-100">
// // //                     <Trash2 className="mr-2 h-4 w-4" />
// // //                     Delete feature
// // //                   </DropdownMenuItem>
// // //                 </DropdownMenuContent>
// // //               </DropdownMenu>
// // //             </div>

// // //             {/* Tab Navigation */}
// // //             <div className="mt-2 border-b">
// // //               <FeatureDetailsTab
// // //                 label="Details"
// // //                 isActive={activeTab === 'details'}
// // //                 onClick={() => handleTabChange('details')}
// // //               />
// // //               <FeatureDetailsTab
// // //                 label="Insights"
// // //                 isActive={activeTab === 'insights'}
// // //                 onClick={() => handleTabChange('insights')}
// // //               />
// // //               <FeatureDetailsTab
// // //                 label="Portal"
// // //                 isActive={activeTab === 'portal'}
// // //                 onClick={() => handleTabChange('portal')}
// // //               />
// // //             </div>
// // //           </SheetHeader>

// // //           {/* Tab Content */}
// // //           {activeTab === 'details' && (
// // //             <DetailsTabContent
// // //               feature={feature}
// // //               draftFeature={draftFeature}
// // //               editingField={editingField}
// // //               editInputRef={editInputRef}
// // //               handleFieldHover={handleFieldHover}
// // //               handleInputChange={handleInputChange}
// // //               handleInputBlur={handleInputBlur}
// // //               handleInputKeyPress={handleInputKeyPress}
// // //               handleStatusChange={handleStatusChange}
// // //             />
// // //           )}
// // //           {activeTab === 'insights' && <InsightsTabContent />}
// // //           {activeTab === 'portal' && <PortalTabContent />}
// // //         </SheetContent>
// // //       </Sheet>
// // //     </div>
// // //   );
// // // }

// // // export default FeatureDetailsPage;




// // // 'use client';

// // // import React, { useEffect, useState, useRef } from 'react';
// // // import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// // // import { Button } from '@/components/ui/button';
// // // import { Trash2, MoreVertical } from 'lucide-react';
// // // import { Feature } from '@/app/types'; // Assuming this type exists
// // // import { Input } from '@/components/ui/input';
// // // import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// // // import { toast } from 'react-hot-toast';

// // // // Enum for status
// // // enum Status {
// // //   TODO = 'Todo',
// // //   IN_PROGRESS = 'In Progress',
// // //   COMPLETED = 'Completed'
// // // }

// // // interface FeatureDetailsPageProps {
// // //   featureId: string;
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // // }

// // // function FeatureDetailsTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
// // //   return (
// // //     <button
// // //       onClick={onClick}
// // //       className={`inline-block py-2 px-4 font-medium text-sm ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
// // //     >
// // //       {label}
// // //     </button>
// // //   );
// // // }

// // // function DetailsTabContent({ feature, draftFeature, editingField, editInputRef, handleFieldHover, handleInputChange, handleInputBlur, handleInputKeyPress, handleStatusChange }: {
// // //   feature: Feature;
// // //   draftFeature: Feature;
// // //   editingField: keyof Feature | null;
// // //   editInputRef: React.RefObject<HTMLInputElement>;
// // //   handleFieldHover: (field: keyof Feature) => void;
// // //   handleInputChange: (field: keyof Feature, value: any) => void;
// // //   handleInputBlur: (field: keyof Feature) => Promise<void>;
// // //   handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => Promise<void>;
// // //   handleStatusChange: (featureId: string, newStatus: Status) => Promise<void>;
// // // }) {
// // //   return (
// // //     <div className="mt-4 space-y-3">
// // //       {/* Status dropdown - positioned at the top */}
// // //       <div className="flex items-center gap-2">
// // //         <span className="text-gray-500 w-32 capitalize">Status</span>
// // //         <select
// // //           value={draftFeature?.status || feature?.status || Status.TODO}
// // //           onChange={(e) => handleStatusChange(feature.id, e.target.value as Status)}
// // //           className="w-full py-2 px-3 border border-gray-300 rounded"
// // //         >
// // //           {Object.values(Status).map(status => (
// // //             <option key={status} value={status}>{status}</option>
// // //           ))}
// // //         </select>
// // //       </div>

// // //       {/* Filter out status field since we're handling it separately above */}
// // //       {(Object.keys(feature || {}) as (keyof Feature)[])
// // //         .filter(key => key !== 'id' && key !== 'name' && key !== 'created_at' && key !== 'status')
// // //         .map((key) => (
// // //           <div key={key} className="flex items-center gap-2">
// // //             <span className="text-gray-500 w-32 capitalize">{key.replace(/_/g, ' ')}</span>
// // //             <div
// // //               className="relative w-full"
// // //               onMouseEnter={() => handleFieldHover(key)}
// // //               onMouseLeave={() => editingField === key && editInputRef.current !== document.activeElement && handleInputBlur(key)}
// // //             >
// // //               {editingField === key ? (
// // //                 <Input
// // //                   ref={editInputRef}
// // //                   type="text" // Adjust type based on the field
// // //                   value={draftFeature[key] !== null && draftFeature[key] !== undefined ? String(draftFeature[key]) : ''}
// // //                   onChange={(e) => handleInputChange(key, e.target.value)}
// // //                   onBlur={() => handleInputBlur(key)}
// // //                   onKeyDown={(e) => handleInputKeyPress(e, key)}
// // //                   className="w-full"
// // //                 />
// // //               ) : (
// // //                 <span>{feature[key] !== null && feature[key] !== undefined ? String(feature[key]) : 'Not assigned'}</span>
// // //               )}
// // //             </div>
// // //           </div>
// // //         ))}
// // //     </div>
// // //   );
// // // }

// // // function InsightsTabContent() {
// // //   return <div>Content for Insights tab</div>;
// // // }

// // // function PortalTabContent() {
// // //   return <div>Content for Portal tab</div>;
// // // }

// // // export function FeatureDetailsPage({ featureId, isOpen, onClose }: FeatureDetailsPageProps) {
// // //   const [feature, setFeature] = useState<Feature | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [editingField, setEditingField] = useState<keyof Feature | null>(null);
// // //   const [draftFeature, setDraftFeature] = useState<Feature | null>(null);
// // //   const editInputRef = useRef<HTMLInputElement>(null);
// // //   const [activeTab, setActiveTab] = useState('details');

// // //   useEffect(() => {
// // //     if (isOpen && featureId) {
// // //       const fetchFeatureDetails = async () => {
// // //         setLoading(true);
// // //         setError(null);
// // //         try {
// // //           const response = await fetch(`/api/features/${featureId}`);

// // //           if (!response.ok) {
// // //             const errorText = await response.text();
// // //             let errorMessage;
// // //             try {
// // //               const errorData = JSON.parse(errorText);
// // //               errorMessage = errorData?.error || `Failed to fetch feature (status ${response.status})`;
// // //             } catch (parseError) {
// // //               errorMessage = `Failed to fetch feature (status ${response.status}): ${errorText.substring(0, 100)}`;
// // //             }
// // //             throw new Error(errorMessage);
// // //           }

// // //           const data: Feature = await response.json();
// // //           setFeature(data);
// // //           setDraftFeature({ ...data });
// // //         } catch (err: any) {
// // //           console.error('Error fetching feature details:', err);
// // //           setError(err.message);
// // //           toast.error(`Failed to load feature: ${err.message}`);
// // //         } finally {
// // //           setLoading(false);
// // //         }
// // //       };
// // //       fetchFeatureDetails();
// // //     } else {
// // //       setFeature(null);
// // //       setDraftFeature(null);
// // //       setEditingField(null);
// // //       setActiveTab('details');
// // //     }
// // //   }, [isOpen, featureId]);

// // //   useEffect(() => {
// // //     // Ensure feature reflects draftFeature immediately after it's updated
// // //     if (draftFeature && draftFeature !== feature) {
// // //       setFeature(draftFeature);  // Update feature state immediately after draftFeature changes
// // //     }
// // //   }, [draftFeature]);

// // //   useEffect(() => {
// // //     if (editingField && editInputRef.current) {
// // //       editInputRef.current.focus();
// // //     }
// // //   }, [editingField]);

// // //   const handleFieldHover = (field: keyof Feature) => {
// // //     setEditingField(field);
// // //   };

// // //   const handleInputChange = (field: keyof Feature, value: any) => {
// // //     setDraftFeature(prev => prev ? { ...prev, [field]: value } : null);
// // //   };

// // //   const handleInputBlur = async (field: keyof Feature) => {
// // //     if (editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
// // //       await saveChanges();
// // //     }
// // //     setEditingField(null);
// // //   };

// // //   const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => {
// // //     if (event.key === 'Enter' && editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
// // //       await saveChanges();
// // //       setEditingField(null);
// // //     } else if (event.key === 'Escape') {
// // //       setDraftFeature(feature ? { ...feature, id: feature.id || '' } : null); // Revert changes
// // //       setEditingField(null);
// // //     }
// // //   };

// // //   const saveChanges = async () => {
// // //     if (!draftFeature || !featureId) return;
// // //     try {
// // //       const response = await fetch(`/api/features/${featureId}`, {
// // //         method: 'PUT',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify(draftFeature),
// // //       });
// // //       if (!response.ok) {
// // //         const errorData = await response.json();
// // //         throw new Error(errorData?.error || `Failed to update feature`);
// // //       }
// // //       const data: Feature = await response.json();
// // //       setFeature(data);
// // //       setDraftFeature(data);  // Update draftFeature immediately after save
// // //       toast.success("Feature updated successfully");
// // //       console.log("Feature updated successfully");
// // //     } catch (error: any) {
// // //       console.error('Error updating feature:', error);
// // //       setDraftFeature(feature);  // Revert draftFeature to original if error occurs
// // //       toast.error(`Failed to update feature: ${error.message}`);
// // //     }
// // //   };

// // //   const handleDelete = async () => {
// // //     if (!featureId) return;
// // //     if (window.confirm('Are you sure you want to delete this feature?')) {
// // //       try {
// // //         const response = await fetch(`/api/features/${featureId}`, {
// // //           method: 'DELETE',
// // //         });
// // //         if (!response.ok) {
// // //           const errorData = await response.json();
// // //           throw new Error(errorData?.error || `Failed to delete feature`);
// // //         }
// // //         console.log("Feature deleted successfully");
// // //         toast.success("Feature deleted successfully");
// // //         onClose();
// // //       } catch (error: any) {
// // //         console.error('Error deleting feature:', error);
// // //         toast.error(`Failed to delete feature: ${error.message}`);
// // //       }
// // //     }
// // //   };

// // //   const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
// // //     setActiveTab(tab);
// // //   };

// // //   // const handleStatusChange = async (featureId: string, newStatus: string) => {
// // //   //   try {
// // //   //     const response = await fetch(`/api/features/${featureId}`, {
// // //   //       method: 'PUT',
// // //   //       headers: { 'Content-Type': 'application/json' },
// // //   //       body: JSON.stringify({ status: newStatus }),
// // //   //     });

// // //   //     const updatedFeature = await response.json();

// // //   //     if (updatedFeature.error) {
// // //   //       console.error('Error updating feature status:', updatedFeature.error);
// // //   //       toast.error(`Failed to update status: ${updatedFeature.error}`);
// // //   //     } else {
// // //   //       setFeature(updatedFeature);
// // //   //       setDraftFeature(updatedFeature);
// // //   //       console.log('Feature status updated successfully:', updatedFeature);
// // //   //       toast.success(`Status updated to ${newStatus}`);
// // //   //     }
// // //   //   } catch (error: any) {
// // //   //     console.error('Error updating feature status:', error);
// // //   //     toast.error(`Failed to update status: ${error.message}`);
// // //   //   }
// // //   // };
  

// // //   const handleStatusChange = async (featureId: string, newStatus: Status) => {
// // //   try {
// // //     const response = await fetch(`/api/features/${featureId}`, {
// // //       method: 'PUT',
// // //       headers: { 'Content-Type': 'application/json' },
// // //       body: JSON.stringify({ status: newStatus }),
// // //     });

// // //     const updatedData = await response.json();

// // //     if (updatedData.error) {
// // //       console.error('Error updating feature status:', updatedData.error);
// // //       toast.error(`Failed to update status: ${updatedData.error}`);
// // //     } else {
// // //       // Ensure the updated status is a valid Status enum value
// // //       if (Object.values(Status).includes(updatedData.status as Status)) {
// // //         setFeature(prevFeature => prevFeature ? { ...prevFeature, status: updatedData.status as Status } : null);
// // //         setDraftFeature(prevDraft => prevDraft ? { ...prevDraft, status: updatedData.status as Status } : null);
// // //         console.log('Feature status updated successfully:', updatedData);
// // //         toast.success(`Status updated to ${newStatus}`);
// // //       } else {
// // //         console.error('Invalid status received from API:', updatedData.status);
// // //         toast.error(`Received invalid status: ${updatedData.status}`);
// // //         // Optionally, you might want to revert the select value in the UI here
// // //       }
// // //     }
// // //   } catch (error: any) {
// // //     console.error('Error updating feature status:', error);
// // //     toast.error(`Failed to update status: ${error.message}`);
// // //   }
// // // };
// // //   if (loading) return <div>Loading...</div>;
// // //   if (error) return <div>Error: {error}</div>;
// // //   if (!feature || !draftFeature) return <div>No feature found</div>;

// // //   return (
// // //     <div className="p-6">
// // //       <Sheet open={isOpen} onOpenChange={onClose}>
// // //         <SheetContent className="sm:max-w-md overflow-y-auto">
// // //           <SheetHeader className="flex flex-col items-start gap-2">
// // //             <div className="flex items-center justify-between w-full">
// // //               <div
// // //                 className="relative w-full"
// // //                 onMouseEnter={() => handleFieldHover('name')}
// // //                 onMouseLeave={() => editingField === 'name' && editInputRef.current !== document.activeElement && handleInputBlur('name')}
// // //               >
// // //                 {editingField === 'name' ? (
// // //                   <Input
// // //                     ref={editInputRef}
// // //                     type="text"
// // //                     value={draftFeature.name || ''}
// // //                     onChange={(e) => handleInputChange('name', e.target.value)}
// // //                     onBlur={() => handleInputBlur('name')}
// // //                     onKeyDown={(e) => handleInputKeyPress(e, 'name')}
// // //                     className="w-full text-lg font-semibold"
// // //                   />
// // //                 ) : (
// // //                   <SheetTitle className="text-lg font-semibold">{feature.name}</SheetTitle>
// // //                 )}
// // //               </div>
// // //               <DropdownMenu>
// // //                 <DropdownMenuTrigger asChild>
// // //                   <Button variant="ghost" className="h-8 w-8 p-0">
// // //                     <MoreVertical className="h-4 w-4" />
// // //                   </Button>
// // //                 </DropdownMenuTrigger>
// // //                 <DropdownMenuContent align="end" sideOffset={4}>
// // //                   <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:bg-red-100">
// // //                     <Trash2 className="mr-2 h-4 w-4" />
// // //                     Delete feature
// // //                   </DropdownMenuItem>
// // //                 </DropdownMenuContent>
// // //               </DropdownMenu>
// // //             </div>

// // //             {/* Tab Navigation */}
// // //             <div className="mt-2 border-b">
// // //               <FeatureDetailsTab
// // //                 label="Details"
// // //                 isActive={activeTab === 'details'}
// // //                 onClick={() => handleTabChange('details')}
// // //               />
// // //               <FeatureDetailsTab
// // //                 label="Insights"
// // //                 isActive={activeTab === 'insights'}
// // //                 onClick={() => handleTabChange('insights')}
// // //               />
// // //               <FeatureDetailsTab
// // //                 label="Portal"
// // //                 isActive={activeTab === 'portal'}
// // //                 onClick={() => handleTabChange('portal')}
// // //               />
// // //             </div>
// // //           </SheetHeader>

// // //           {/* Tab Content */}
// // //           {activeTab === 'details' && (
// // //             <DetailsTabContent
// // //               feature={feature}
// // //               draftFeature={draftFeature}
// // //               editingField={editingField}
// // //               editInputRef={editInputRef}
// // //               handleFieldHover={handleFieldHover}
// // //               handleInputChange={handleInputChange}
// // //               handleInputBlur={handleInputBlur}
// // //               handleInputKeyPress={handleInputKeyPress}
// // //               handleStatusChange={handleStatusChange}
// // //             />
// // //           )}
// // //           {activeTab === 'insights' && <InsightsTabContent />}
// // //           {activeTab === 'portal' && <PortalTabContent />}
// // //         </SheetContent>
// // //       </Sheet>
// // //     </div>
// // //   );
// // // }

// // // export default FeatureDetailsPage;



// // 'use client';

// // import React, { useEffect, useState, useRef } from 'react';
// // import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// // import { Button } from '@/components/ui/button';
// // import { Trash2, MoreVertical } from 'lucide-react';
// // import { Feature } from '@/app/types'; // Assuming this type exists
// // import { Input } from '@/components/ui/input';
// // import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// // // Enum for status
// // enum Status {
// //   TODO = 'Todo',
// //   IN_PROGRESS = 'In Progress',
// //   COMPLETED = 'Completed'
// // }

// // interface FeatureDetailsPageProps {
// //   featureId: string;
// //   isOpen: boolean;
// //   onClose: () => void;
// // }

// // function FeatureDetailsTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       className={`inline-block py-2 px-4 font-medium text-sm ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
// //     >
// //       {label}
// //     </button>
// //   );
// // }

// // function DetailsTabContent({ feature, draftFeature, editingField, editInputRef, handleFieldHover, handleInputChange, handleInputBlur, handleInputKeyPress, handleStatusChange }: {
// //   feature: Feature;
// //   draftFeature: Feature;
// //   editingField: keyof Feature | null;
// //   editInputRef: React.RefObject<HTMLInputElement>;
// //   handleFieldHover: (field: keyof Feature) => void;
// //   handleInputChange: (field: keyof Feature, value: any) => void;
// //   handleInputBlur: (field: keyof Feature) => Promise<void>;
// //   handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => Promise<void>;
// //   handleStatusChange: (featureId: string, newStatus: Status) => Promise<void>;
// // }) {
// //   return (
// //     <div className="mt-4 space-y-3">
// //       {/* Status dropdown - positioned at the top */}
// //       <div className="flex items-center gap-2">
// //         <span className="text-gray-500 w-32 capitalize">Status</span>
// //         <select
// //           value={draftFeature?.status || feature?.status || Status.TODO}
// //           onChange={(e) => handleStatusChange(feature.id, e.target.value as Status)}
// //           className="w-full py-2 px-3 border border-gray-300 rounded"
// //         >
// //           {Object.values(Status).map(status => (
// //             <option key={status} value={status}>{status}</option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* Progress field (now showing automatically calculated value) */}
// //       <div className="flex items-center gap-2">
// //         <span className="text-gray-500 w-32 capitalize">Progress</span>
// //         <div className="w-full flex items-center">
// //           <div className="w-full bg-gray-200 rounded-full h-2.5">
// //             <div 
// //               className="bg-blue-600 h-2.5 rounded-full" 
// //               style={{ width: `${draftFeature.progress || 0}%` }}
// //             ></div>
// //           </div>
// //           <span className="ml-2">{draftFeature.progress || 0}%</span>
// //         </div>
// //       </div>

// //       {/* Filter out status field since we're handling it separately above */}
// //       {(Object.keys(feature || {}) as (keyof Feature)[])
// //         .filter(key => key !== 'id' && key !== 'name' && key !== 'created_at' && key !== 'status' && key !== 'progress')
// //         .map((key) => (
// //           <div key={key} className="flex items-center gap-2">
// //             <span className="text-gray-500 w-32 capitalize">{key.replace(/_/g, ' ')}</span>
// //             <div
// //               className="relative w-full"
// //               onMouseEnter={() => handleFieldHover(key)}
// //               onMouseLeave={() => editingField === key && editInputRef.current !== document.activeElement && handleInputBlur(key)}
// //             >
// //               {editingField === key ? (
// //                 <Input
// //                   ref={editInputRef}
// //                   type="text" // Adjust type based on the field
// //                   value={draftFeature[key] !== null && draftFeature[key] !== undefined ? String(draftFeature[key]) : ''}
// //                   onChange={(e) => handleInputChange(key, e.target.value)}
// //                   onBlur={() => handleInputBlur(key)}
// //                   onKeyDown={(e) => handleInputKeyPress(e, key)}
// //                   className="w-full"
// //                 />
// //               ) : (
// //                 <span>{feature[key] !== null && feature[key] !== undefined ? String(feature[key]) : 'Not assigned'}</span>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //     </div>
// //   );
// // }

// // function InsightsTabContent() {
// //   return <div>Content for Insights tab</div>;
// // }

// // function PortalTabContent() {
// //   return <div>Content for Portal tab</div>;
// // }

// // export function FeatureDetailsPage({ featureId, isOpen, onClose }: FeatureDetailsPageProps) {
// //   const [feature, setFeature] = useState<Feature | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [editingField, setEditingField] = useState<keyof Feature | null>(null);
// //   const [draftFeature, setDraftFeature] = useState<Feature | null>(null);
// //   const [updatingProgress, setUpdatingProgress] = useState(false);
// //   const editInputRef = useRef<HTMLInputElement>(null);
// //   const [activeTab, setActiveTab] = useState('details');

// //   // Helper function to calculate progress based on status
// //   const calculateProgressFromStatus = (status: Status): number => {
// //     switch (status) {
// //       case Status.COMPLETED:
// //         return 100;
// //       case Status.IN_PROGRESS:
// //         return 50;
// //       case Status.TODO:
// //       default:
// //         return 0;
// //     }
// //   };

// //   useEffect(() => {
// //     if (isOpen && featureId) {
// //       const fetchFeatureDetails = async () => {
// //         setLoading(true);
// //         setError(null);
// //         try {
// //           const response = await fetch(`/api/features/${featureId}`);

// //           if (!response.ok) {
// //             const errorText = await response.text();
// //             let errorMessage;
// //             try {
// //               const errorData = JSON.parse(errorText);
// //               errorMessage = errorData?.error || `Failed to fetch feature (status ${response.status})`;
// //             } catch (parseError) {
// //               errorMessage = `Failed to fetch feature (status ${response.status}): ${errorText.substring(0, 100)}`;
// //             }
// //             throw new Error(errorMessage);
// //           }

// //           const data: Feature = await response.json();
// //           setFeature(data);
// //           setDraftFeature({ ...data });
// //         } catch (err: any) {
// //           console.error('Error fetching feature details:', err);
// //           setError(err.message);
// //         } finally {
// //           setLoading(false);
// //         }
// //       };
// //       fetchFeatureDetails();
// //     } else {
// //       setFeature(null);
// //       setDraftFeature(null);
// //       setEditingField(null);
// //       setActiveTab('details');
// //     }
// //   }, [isOpen, featureId]);

// //   useEffect(() => {
// //     if (editingField && editInputRef.current) {
// //       editInputRef.current.focus();
// //     }
// //   }, [editingField]);

// //   const handleFieldHover = (field: keyof Feature) => {
// //     setEditingField(field);
// //   };

// //   const handleInputChange = (field: keyof Feature, value: any) => {
// //     setDraftFeature(prev => prev ? { ...prev, [field]: value } : null);
// //   };

// //   const handleInputBlur = async (field: keyof Feature) => {
// //     if (editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
// //       await saveChanges();
// //     }
// //     setEditingField(null);
// //   };

// //   const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => {
// //     if (event.key === 'Enter' && editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
// //       await saveChanges();
// //       setEditingField(null);
// //     } else if (event.key === 'Escape') {
// //       setDraftFeature(feature ? { ...feature, id: feature.id || '' } : null); // Revert changes
// //       setEditingField(null);
// //     }
// //   };

// //   const saveChanges = async () => {
// //     if (!draftFeature || !featureId) return;
// //     setFeature(draftFeature); 
// //     try {
// //       const response = await fetch(`/api/features/${featureId}`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(draftFeature),
// //       });
// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData?.error || `Failed to update feature`);
// //       }
// //       const data: Feature = await response.json();
// //       setFeature(data);
// //       setDraftFeature(data);
// //       console.log("Feature updated successfully");
// //     } catch (error) {
// //       console.error('Error updating feature:', error);
// //       setDraftFeature(feature);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (!featureId) return;
// //     if (window.confirm('Are you sure you want to delete this feature?')) {
// //       try {
// //         const response = await fetch(`/api/features/${featureId}`, {
// //           method: 'DELETE',
// //         });
// //         if (!response.ok) {
// //           const errorData = await response.json();
// //           throw new Error(errorData?.error || `Failed to delete feature`);
// //         }
// //         console.log("Feature deleted successfully");
// //         onClose();
// //       } catch (error) {
// //         console.error('Error deleting feature:', error);
// //       }
// //     }
// //   };

// //   const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
// //     setActiveTab(tab);
// //   };

// //   const handleStatusChange = async (featureId: string, newStatus: string) => {
// //     setUpdatingProgress(true);
// //     try {
// //       // Calculate progress based on status
// //       const statusProgress = calculateProgressFromStatus(newStatus as Status);
      
// //       // Update local state immediately for better UX
// //       setDraftFeature(prev => prev ? { 
// //         ...prev, 
// //         status: newStatus as Status, 
// //         progress: statusProgress 
// //       } : null);
      
// //       // Send to server
// //       const response = await fetch(`/api/features/${featureId}`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ 
// //           status: newStatus,
// //           progress: statusProgress, // Send the calculated progress
// //         }),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to update feature status');
// //       }

// //       const updatedFeature = await response.json();
// //       setFeature(updatedFeature);
// //       setDraftFeature(updatedFeature);
      
// //       console.log('Feature status updated successfully:', updatedFeature);
// //     } catch (error) {
// //       console.error('Error updating feature status:', error);
// //       // Reset draftFeature if there was an error
// //       setDraftFeature(feature);
// //     } finally {
// //       setUpdatingProgress(false);
// //     }
// //   };

// //   if (loading) return <div>Loading...</div>;
// //   if (error) return <div>Error: {error}</div>;
// //   if (!feature || !draftFeature) return <div>No feature found</div>;

// //   return (
// //     <div className="p-6">
// //       <Sheet open={isOpen} onOpenChange={onClose}>
// //         <SheetContent className="sm:max-w-md overflow-y-auto">
// //           <SheetHeader className="flex flex-col items-start gap-2">
// //             <div className="flex items-center justify-between w-full">
// //               <div
// //                 className="relative w-full"
// //                 onMouseEnter={() => handleFieldHover('name')}
// //                 onMouseLeave={() => editingField === 'name' && editInputRef.current !== document.activeElement && handleInputBlur('name')}
// //               >
// //                 {editingField === 'name' ? (
// //                   <Input
// //                     ref={editInputRef}
// //                     type="text"
// //                     value={draftFeature.name || ''}
// //                     onChange={(e) => handleInputChange('name', e.target.value)}
// //                     onBlur={() => handleInputBlur('name')}
// //                     onKeyDown={(e) => handleInputKeyPress(e, 'name')}
// //                     className="w-full text-lg font-semibold"
// //                   />
// //                 ) : (
// //                   <SheetTitle className="text-lg font-semibold">{feature.name}</SheetTitle>
// //                 )}
// //               </div>
// //               <DropdownMenu>
// //                 <DropdownMenuTrigger asChild>
// //                   <Button variant="ghost" className="h-8 w-8 p-0">
// //                     <MoreVertical className="h-4 w-4" />
// //                   </Button>
// //                 </DropdownMenuTrigger>
// //                 <DropdownMenuContent align="end" sideOffset={4}>
// //                   <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:bg-red-100">
// //                     <Trash2 className="mr-2 h-4 w-4" />
// //                     Delete feature
// //                   </DropdownMenuItem>
// //                 </DropdownMenuContent>
// //               </DropdownMenu>
// //             </div>

// //             {/* Tab Navigation */}
// //             <div className="mt-2 border-b">
// //               <FeatureDetailsTab
// //                 label="Details"
// //                 isActive={activeTab === 'details'}
// //                 onClick={() => handleTabChange('details')}
// //               />
// //               <FeatureDetailsTab
// //                 label="Insights"
// //                 isActive={activeTab === 'insights'}
// //                 onClick={() => handleTabChange('insights')}
// //               />
// //               <FeatureDetailsTab
// //                 label="Portal"
// //                 isActive={activeTab === 'portal'}
// //                 onClick={() => handleTabChange('portal')}
// //               />
// //             </div>
// //           </SheetHeader>

// //           {/* Tab Content */}
// //           {activeTab === 'details' && (
// //             <DetailsTabContent
// //               feature={feature}
// //               draftFeature={draftFeature}
// //               editingField={editingField}
// //               editInputRef={editInputRef}
// //               handleFieldHover={handleFieldHover}
// //               handleInputChange={handleInputChange}
// //               handleInputBlur={handleInputBlur}
// //               handleInputKeyPress={handleInputKeyPress}
// //               handleStatusChange={handleStatusChange}
// //             />
// //           )}
// //           {activeTab === 'insights' && <InsightsTabContent />}
// //           {activeTab === 'portal' && <PortalTabContent />}
          
// //           {updatingProgress && (
// //             <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded text-sm">
// //               Updating progress and recalculating component and product metrics...
// //             </div>
// //           )}
// //         </SheetContent>
// //       </Sheet>
// //     </div>
// //   );
// // }

// // export default FeatureDetailsPage;





// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// import { Button } from '@/components/ui/button';
// import { Trash2, MoreVertical } from 'lucide-react';
// import { Feature } from '@/app/types'; // Assuming this type exists
// import { Input } from '@/components/ui/input';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// // Enum for status
// enum Status {
//   TODO = 'Todo',
//   IN_PROGRESS = 'In Progress',
//   COMPLETED = 'Completed'
// }

// interface FeatureDetailsPageProps {
//   featureId: string;
//   isOpen: boolean;
//   onClose: () => void;
//   onFeatureUpdated?: (updatedFeature: Feature) => void;
// }

// function FeatureDetailsTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`inline-block py-2 px-4 font-medium text-sm ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
//     >
//       {label}
//     </button>
//   );
// }

// function DetailsTabContent({ feature, draftFeature, editingField, editInputRef, handleFieldHover, handleInputChange, handleInputBlur, handleInputKeyPress, handleStatusChange }: {
//   feature: Feature;
//   draftFeature: Feature;
//   editingField: keyof Feature | null;
//   editInputRef: React.RefObject<HTMLInputElement>;
//   handleFieldHover: (field: keyof Feature) => void;
//   handleInputChange: (field: keyof Feature, value: any) => void;
//   handleInputBlur: (field: keyof Feature) => Promise<void>;
//   handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => Promise<void>;
//   handleStatusChange: (featureId: string, newStatus: Status) => Promise<void>;
// }) {
//   return (
//     <div className="mt-4 space-y-3">
//       {/* Status dropdown - positioned at the top */}
//       <div className="flex items-center gap-2">
//         <span className="text-gray-500 w-32 capitalize">Status</span>
//         <select
//           value={draftFeature?.status || feature?.status || Status.TODO}
//           onChange={(e) => handleStatusChange(feature.id, e.target.value as Status)}
//           className="w-full py-2 px-3 border border-gray-300 rounded"
//         >
//           {Object.values(Status).map(status => (
//             <option key={status} value={status}>{status}</option>
//           ))}
//         </select>
//       </div>

//       {/* Progress field (now showing automatically calculated value) */}
//       <div className="flex items-center gap-2">
//         <span className="text-gray-500 w-32 capitalize">Progress</span>
//         <div className="w-full flex items-center">
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div 
//               className="bg-blue-600 h-2.5 rounded-full" 
//               style={{ width: `${draftFeature.progress || 0}%` }}
//             ></div>
//           </div>
//           <span className="ml-2">{draftFeature.progress || 0}%</span>
//         </div>
//       </div>

//       {/* Filter out status field since we're handling it separately above */}
//       {(Object.keys(feature || {}) as (keyof Feature)[])
//         .filter(key => key !== 'id' && key !== 'name' && key !== 'created_at' && key !== 'status' && key !== 'progress')
//         .map((key) => (
//           <div key={key} className="flex items-center gap-2">
//             <span className="text-gray-500 w-32 capitalize">{key.replace(/_/g, ' ')}</span>
//             <div
//               className="relative w-full"
//               onMouseEnter={() => handleFieldHover(key)}
//               onMouseLeave={() => editingField === key && editInputRef.current !== document.activeElement && handleInputBlur(key)}
//             >
//               {editingField === key ? (
//                 <Input
//                   ref={editInputRef}
//                   type="text" // Adjust type based on the field
//                   value={draftFeature[key] !== null && draftFeature[key] !== undefined ? String(draftFeature[key]) : ''}
//                   onChange={(e) => handleInputChange(key, e.target.value)}
//                   onBlur={() => handleInputBlur(key)}
//                   onKeyDown={(e) => handleInputKeyPress(e, key)}
//                   className="w-full"
//                 />
//               ) : (
//                 <span>{feature[key] !== null && feature[key] !== undefined ? String(feature[key]) : 'Not assigned'}</span>
//               )}
//             </div>
//           </div>
//         ))}
//     </div>
//   );
// }

// function InsightsTabContent() {
//   return <div>Content for Insights tab</div>;
// }

// function PortalTabContent() {
//   return <div>Content for Portal tab</div>;
// }

// export function FeatureDetailsPage({ featureId, isOpen, onClose }: FeatureDetailsPageProps) {
//   const [feature, setFeature] = useState<Feature | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [editingField, setEditingField] = useState<keyof Feature | null>(null);
//   const [draftFeature, setDraftFeature] = useState<Feature | null>(null);
//   const [updatingProgress, setUpdatingProgress] = useState(false);
//   const editInputRef = useRef<HTMLInputElement>(null);
//   const [activeTab, setActiveTab] = useState('details');

//   // Helper function to calculate progress based on status
//   const calculateProgressFromStatus = (status: Status): number => {
//     switch (status) {
//       case Status.COMPLETED:
//         return 100;
//       case Status.IN_PROGRESS:
//         return 50;
//       case Status.TODO:
//       default:
//         return 0;
//     }
//   };

//   useEffect(() => {
//     if (isOpen && featureId) {
//       const fetchFeatureDetails = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//           const response = await fetch(`/api/features/${featureId}`);

//           if (!response.ok) {
//             const errorText = await response.text();
//             let errorMessage;
//             try {
//               const errorData = JSON.parse(errorText);
//               errorMessage = errorData?.error || `Failed to fetch feature (status ${response.status})`;
//             } catch (parseError) {
//               errorMessage = `Failed to fetch feature (status ${response.status}): ${errorText.substring(0, 100)}`;
//             }
//             throw new Error(errorMessage);
//           }

//           const data: Feature = await response.json();
//           setFeature(data);
//           setDraftFeature({ ...data });
//         } catch (err: any) {
//           console.error('Error fetching feature details:', err);
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchFeatureDetails();
//     } else {
//       setFeature(null);
//       setDraftFeature(null);
//       setEditingField(null);
//       setActiveTab('details');
//     }
//   }, [isOpen, featureId]);

//   useEffect(() => {
//     if (editingField && editInputRef.current) {
//       editInputRef.current.focus();
//     }
//   }, [editingField]);

//   const handleFieldHover = (field: keyof Feature) => {
//     setEditingField(field);
//   };

//   const handleInputChange = (field: keyof Feature, value: any) => {
//     setDraftFeature(prev => prev ? { ...prev, [field]: value } : null);
//   };

//   const handleInputBlur = async (field: keyof Feature) => {
//     if (editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
//       await saveChanges();
//     }
//     setEditingField(null);
//   };

//   const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => {
//     if (event.key === 'Enter' && editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
//       await saveChanges();
//       setEditingField(null);
//     } else if (event.key === 'Escape') {
//       setDraftFeature(feature ? { ...feature, id: feature.id || '' } : null); // Revert changes
//       setEditingField(null);
//     }
//   };

//   const saveChanges = async () => {
//     if (!draftFeature || !featureId) return;
//     setFeature(draftFeature); 
//     try {
//       const response = await fetch(`/api/features/${featureId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(draftFeature),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData?.error || `Failed to update feature`);
//       }
//       const data: Feature = await response.json();
//       setFeature(data);
//       setDraftFeature(data);
//       console.log("Feature updated successfully");


//     } catch (error) {
//       console.error('Error updating feature:', error);
//       setDraftFeature(feature);
//     }
//   };

//   const handleDelete = async () => {
//     if (!featureId) return;
//     if (window.confirm('Are you sure you want to delete this feature?')) {
//       try {
//         const response = await fetch(`/api/features/${featureId}`, {
//           method: 'DELETE',
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData?.error || `Failed to delete feature`);
//         }
//         console.log("Feature deleted successfully");
//         onClose();
//       } catch (error) {
//         console.error('Error deleting feature:', error);
//       }
//     }
//   };

//   const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
//     setActiveTab(tab);
//   };

//   const handleStatusChange = async (featureId: string, newStatus: string) => {
//     setUpdatingProgress(true);
//     try {
//       // Calculate progress based on status
//       const statusProgress = calculateProgressFromStatus(newStatus as Status);
      
//       // Update local state immediately for better UX
//       setDraftFeature(prev => prev ? { 
//         ...prev, 
//         status: newStatus as Status, 
//         progress: statusProgress 
//       } : null);
      
//       // Send to server
//       const response = await fetch(`/api/features/${featureId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           status: newStatus,
//           progress: statusProgress, // Send the calculated progress
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update feature status');
//       }

//       const updatedFeature = await response.json();
//       setFeature(updatedFeature);
//       setDraftFeature(updatedFeature);
      
//       console.log('Feature status updated successfully:', updatedFeature);
//     } catch (error) {
//       console.error('Error updating feature status:', error);
//       // Reset draftFeature if there was an error
//       setDraftFeature(feature);
//     } finally {
//       setUpdatingProgress(false);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!feature || !draftFeature) return <div>No feature found</div>;

//   return (
//     <div className="p-6">
//       <Sheet open={isOpen} onOpenChange={onClose}>
//         <SheetContent className="sm:max-w-md overflow-y-auto">
//           <SheetHeader className="flex flex-col items-start gap-2">
//             <div className="flex items-center justify-between w-full">
//               <div
//                 className="relative w-full"
//                 onMouseEnter={() => handleFieldHover('name')}
//                 onMouseLeave={() => editingField === 'name' && editInputRef.current !== document.activeElement && handleInputBlur('name')}
//               >
//                 {editingField === 'name' ? (
//                   <Input
//                     ref={editInputRef}
//                     type="text"
//                     value={draftFeature.name || ''}
//                     onChange={(e) => handleInputChange('name', e.target.value)}
//                     onBlur={() => handleInputBlur('name')}
//                     onKeyDown={(e) => handleInputKeyPress(e, 'name')}
//                     className="w-full text-lg font-semibold"
//                   />
//                 ) : (
//                   <SheetTitle className="text-lg font-semibold">{feature.name}</SheetTitle>
//                 )}
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="h-8 w-8 p-0">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" sideOffset={4}>
//                   <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:bg-red-100">
//                     <Trash2 className="mr-2 h-4 w-4" />
//                     Delete feature
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             {/* Tab Navigation */}
//             <div className="mt-2 border-b">
//               <FeatureDetailsTab
//                 label="Details"
//                 isActive={activeTab === 'details'}
//                 onClick={() => handleTabChange('details')}
//               />
//               <FeatureDetailsTab
//                 label="Insights"
//                 isActive={activeTab === 'insights'}
//                 onClick={() => handleTabChange('insights')}
//               />
//               <FeatureDetailsTab
//                 label="Portal"
//                 isActive={activeTab === 'portal'}
//                 onClick={() => handleTabChange('portal')}
//               />
//             </div>
//           </SheetHeader>

//           {/* Tab Content */}
//           {activeTab === 'details' && (
//             <DetailsTabContent
//               feature={feature}
//               draftFeature={draftFeature}
//               editingField={editingField}
//               editInputRef={editInputRef}
//               handleFieldHover={handleFieldHover}
//               handleInputChange={handleInputChange}
//               handleInputBlur={handleInputBlur}
//               handleInputKeyPress={handleInputKeyPress}
//               handleStatusChange={handleStatusChange}
//             />
//           )}
//           {activeTab === 'insights' && <InsightsTabContent />}
//           {activeTab === 'portal' && <PortalTabContent />}
          
//           {updatingProgress && (
//             <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded text-sm">
//               Updating progress and recalculating component and product metrics...
//             </div>
//           )}
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }

// export default FeatureDetailsPage;



'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, MoreVertical } from 'lucide-react';
import { Feature } from '@/app/types'; // Assuming this type exists
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Enum for status
enum Status {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

interface FeatureDetailsPageProps {
  featureId: string;
  isOpen: boolean;
  onClose: () => void;
  onFeatureUpdated?: (updatedFeature: Feature) => void; // Add this prop
}

function FeatureDetailsTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-block py-2 px-4 font-medium text-sm ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
    >
      {label}
    </button>
  );
}

function DetailsTabContent({ feature, draftFeature, editingField, editInputRef, handleFieldHover, handleInputChange, handleInputBlur, handleInputKeyPress, handleStatusChange }: {
  feature: Feature;
  draftFeature: Feature;
  editingField: keyof Feature | null;
  editInputRef: React.RefObject<HTMLInputElement>;
  handleFieldHover: (field: keyof Feature) => void;
  handleInputChange: (field: keyof Feature, value: any) => void;
  handleInputBlur: (field: keyof Feature) => Promise<void>;
  handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => Promise<void>;
  handleStatusChange: (featureId: string, newStatus: Status) => Promise<void>;
}) {
  return (
    <div className="mt-4 space-y-3">
      {/* Status dropdown - positioned at the top */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 w-32 capitalize">Status</span>
        <select
          value={draftFeature?.status || feature?.status || Status.TODO}
          onChange={(e) => handleStatusChange(feature.id, e.target.value as Status)}
          className="w-full py-2 px-3 border border-gray-300 rounded"
        >
          {Object.values(Status).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Progress field (now showing automatically calculated value) */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 w-32 capitalize">Progress</span>
        <div className="w-full flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${draftFeature.progress || 0}%` }}
            ></div>
          </div>
          <span className="ml-2">{draftFeature.progress || 0}%</span>
        </div>
      </div>

      {/* Filter out status field since we're handling it separately above */}
      {(Object.keys(feature || {}) as (keyof Feature)[])
        .filter(key => key !== 'id' && key !== 'name' && key !== 'created_at' && key !== 'status' && key !== 'progress')
        .map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-gray-500 w-32 capitalize">{key.replace(/_/g, ' ')}</span>
            <div
              className="relative w-full"
              onMouseEnter={() => handleFieldHover(key)}
              onMouseLeave={() => editingField === key && editInputRef.current !== document.activeElement && handleInputBlur(key)}
            >
              {editingField === key ? (
                <Input
                  ref={editInputRef}
                  type="text" // Adjust type based on the field
                  value={draftFeature[key] !== null && draftFeature[key] !== undefined ? String(draftFeature[key]) : ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  onBlur={() => handleInputBlur(key)}
                  onKeyDown={(e) => handleInputKeyPress(e, key)}
                  className="w-full"
                />
              ) : (
                <span>{feature[key] !== null && feature[key] !== undefined ? String(feature[key]) : 'Not assigned'}</span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

function InsightsTabContent() {
  return <div>Content for Insights tab</div>;
}

function PortalTabContent() {
  return <div>Content for Portal tab</div>;
}

export function FeatureDetailsPage({ featureId, isOpen, onClose, onFeatureUpdated }: FeatureDetailsPageProps) {
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<keyof Feature | null>(null);
  const [draftFeature, setDraftFeature] = useState<Feature | null>(null);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('details');

  // Helper function to calculate progress based on status
  const calculateProgressFromStatus = (status: Status): number => {
    switch (status) {
      case Status.COMPLETED:
        return 100;
      case Status.IN_PROGRESS:
        return 50;
      case Status.TODO:
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (isOpen && featureId) {
      const fetchFeatureDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/features/${featureId}`);

          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData?.error || `Failed to fetch feature (status ${response.status})`;
            } catch (parseError) {
              errorMessage = `Failed to fetch feature (status ${response.status}): ${errorText.substring(0, 100)}`;
            }
            throw new Error(errorMessage);
          }

          const data: Feature = await response.json();
          setFeature(data);
          setDraftFeature({ ...data });
        } catch (err: any) {
          console.error('Error fetching feature details:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchFeatureDetails();
    } else {
      setFeature(null);
      setDraftFeature(null);
      setEditingField(null);
      setActiveTab('details');
    }
  }, [isOpen, featureId]);

  useEffect(() => {
    if (editingField && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingField]);

  const handleFieldHover = (field: keyof Feature) => {
    setEditingField(field);
  };

  const handleInputChange = (field: keyof Feature, value: any) => {
    setDraftFeature(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleInputBlur = async (field: keyof Feature) => {
    if (editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
      await saveChanges();
    }
    setEditingField(null);
  };

  const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Feature) => {
    if (event.key === 'Enter' && editingField === field && feature && draftFeature && feature[field] !== draftFeature[field]) {
      await saveChanges();
      setEditingField(null);
    } else if (event.key === 'Escape') {
      setDraftFeature(feature ? { ...feature, id: feature.id || '' } : null); // Revert changes
      setEditingField(null);
    }
  };

  const saveChanges = async () => {
    if (!draftFeature || !featureId) return;
    setFeature(draftFeature); 
    try {
      const response = await fetch(`/api/features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftFeature),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Failed to update feature`);
      }
      const data: Feature = await response.json();
      setFeature(data);
      setDraftFeature(data);
      console.log("Feature updated successfully");
      
      // Call the callback with updated feature
      if (onFeatureUpdated) {
        onFeatureUpdated(data);
      }
    } catch (error) {
      console.error('Error updating feature:', error);
      setDraftFeature(feature);
    }
  };

  const handleDelete = async () => {
    if (!featureId) return;
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        const response = await fetch(`/api/features/${featureId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || `Failed to delete feature`);
        }
        console.log("Feature deleted successfully");
        onClose();
      } catch (error) {
        console.error('Error deleting feature:', error);
      }
    }
  };

  const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
    setActiveTab(tab);
  };

  const handleStatusChange = async (featureId: string, newStatus: string) => {
    setUpdatingProgress(true);
    try {
      // Calculate progress based on status
      const statusProgress = calculateProgressFromStatus(newStatus as Status);
      
      // Update local state immediately for better UX
      setDraftFeature(prev => prev ? { 
        ...prev, 
        status: newStatus as Status, 
        progress: statusProgress 
      } : null);
      
      // Send to server
      const response = await fetch(`/api/features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          progress: statusProgress, // Send the calculated progress
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update feature status');
      }

      const updatedFeature = await response.json();
      setFeature(updatedFeature);
      setDraftFeature(updatedFeature);
      
      // Call the callback with updated feature
      if (onFeatureUpdated) {
        onFeatureUpdated(updatedFeature);
      }
      
      console.log('Feature status updated successfully:', updatedFeature);
    } catch (error) {
      console.error('Error updating feature status:', error);
      // Reset draftFeature if there was an error
      setDraftFeature(feature);
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!feature || !draftFeature) return <div>No feature found</div>;

  return (
    <div className="p-6">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="flex flex-col items-start gap-2">
            <div className="flex items-center justify-between w-full">
              <div
                className="relative w-full"
                onMouseEnter={() => handleFieldHover('name')}
                onMouseLeave={() => editingField === 'name' && editInputRef.current !== document.activeElement && handleInputBlur('name')}
              >
                {editingField === 'name' ? (
                  <Input
                    ref={editInputRef}
                    type="text"
                    value={draftFeature.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleInputBlur('name')}
                    onKeyDown={(e) => handleInputKeyPress(e, 'name')}
                    className="w-full text-lg font-semibold"
                  />
                ) : (
                  <SheetTitle className="text-lg font-semibold">{feature.name}</SheetTitle>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={4}>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:bg-red-100">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete feature
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tab Navigation */}
            <div className="mt-2 border-b">
              <FeatureDetailsTab
                label="Details"
                isActive={activeTab === 'details'}
                onClick={() => handleTabChange('details')}
              />
              <FeatureDetailsTab
                label="Insights"
                isActive={activeTab === 'insights'}
                onClick={() => handleTabChange('insights')}
              />
              <FeatureDetailsTab
                label="Portal"
                isActive={activeTab === 'portal'}
                onClick={() => handleTabChange('portal')}
              />
            </div>
          </SheetHeader>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <DetailsTabContent
              feature={feature}
              draftFeature={draftFeature}
              editingField={editingField}
              editInputRef={editInputRef}
              handleFieldHover={handleFieldHover}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              handleInputKeyPress={handleInputKeyPress}
              handleStatusChange={handleStatusChange}
            />
          )}
          {activeTab === 'insights' && <InsightsTabContent />}
          {activeTab === 'portal' && <PortalTabContent />}
          
          {updatingProgress && (
            <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded text-sm">
              Updating progress and recalculating component and product metrics...
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default FeatureDetailsPage;