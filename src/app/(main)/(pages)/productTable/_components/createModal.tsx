

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Component } from '@/app/types/index';

interface CreateComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  onComponentCreated: (component: Component, productId: string) => void;
}

const CreateComponentModal: React.FC<CreateComponentModalProps> = ({ 
  isOpen, 
  onClose, 
  productId, 
  onComponentCreated 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'Todo',
    progress: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productId) {
      console.error('Product ID is null, cannot create component.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('components')
        .insert([{ 
          name: formData.name, 
          status: formData.status, 
          progress: formData.progress, 
          product_id: productId 
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        onComponentCreated(data[0], productId);
        onClose();
        setFormData({
          name: '',
          status: 'Todo',
          progress: 0,
        });
      }
    } catch (error) {
      console.error('Error creating component:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Create New Component</h2>
          <p className="text-gray-500 text-sm mt-1">
            Fill out the form below to create a new component.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Component Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                type="number"
                id="progress"
                name="progress"
                value={formData.progress === null ? '' : formData.progress}
                onChange={handleChange}
                min={0}
                max={100}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComponentModal;