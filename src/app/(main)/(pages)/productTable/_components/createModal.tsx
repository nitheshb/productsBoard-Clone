'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TeamDropdown } from '@/components/ui/team-dropdown';
import { Component } from '@/app/types/index';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string | null; // now optional for update
  onComponentCreated: (product: any, productId: string) => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ 
  isOpen, 
  onClose, 
  productId = null, 
  onComponentCreated 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    status: 'Todo',
    progress: 0,
    version: '1.0.0',
    team: '', // Added team field
    description: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch product data if editing
  React.useEffect(() => {
    if (productId && isOpen) {
      setLoading(true);
      fetch(`/api/product/${productId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            name: data.name || '',
            status: data.status || 'Todo',
            progress: data.progress || 0,
            version: data.version || '1.0.0',
            team: data.team || '', // Fetch team
            description: data.description || '',
          });
        })
        .finally(() => setLoading(false));
    } else if (!productId && isOpen) {
      setFormData({
        name: '',
        status: 'Todo',
        progress: 0,
        version: '1.0.0',
        team: '', // Reset team
        description: '',
      });
    }
  }, [productId, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: value === '' ? null : value,
      };
      
      // Automatically update status based on progress
      if (name === 'progress') {
        const progressValue = parseInt(value) || 0;
        let newStatus = prev.status;
        
        if (progressValue === 0) {
          newStatus = 'Todo';
        } else if (progressValue === 100) {
          newStatus = 'Completed';
        } else if (progressValue > 0 && progressValue < 100) {
          newStatus = 'In Progress';
        }
        
        updatedData.status = newStatus;
      }
      
      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data, error;
      if (productId) {
        // Update
        const response = await fetch(`/api/product/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update product');
        data = [await response.json()];
        toast("Product updated successfully!");
      } else {
        // Create
        const response = await fetch('/api/product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create product');
        data = [await response.json()];
        toast("Product created successfully!");
      }
      if (data && data.length > 0) {
        onComponentCreated(data[0], data[0].id);
        onClose();
        setFormData({
          name: '',
          status: 'Todo',
          progress: 0,
          version: '1.0.0',
          team: '', // Reset team
          description: '',
        });
      }
    } catch (error) {
      toast.error("Error creating/updating product: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">{productId ? 'Edit Product' : 'Create New Product'}</h2>
          <p className="text-black text-sm mt-1">
            Fill out the form below to {productId ? 'update' : 'create'} a product.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name || ''} 
                onChange={handleChange} 
                required 
                className="mt-1"
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                name="version"
                value={formData.version || ''}
                onChange={handleChange}
                placeholder="e.g., 1.0.0"
                className="mt-1"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="team">Team</Label>
              <TeamDropdown
                value={formData.team || ""}
                onChange={(value) => setFormData(prev => ({ ...prev, team: value }))}
                placeholder="Select or add team member"
                className="mt-1"
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Enter product description"
                className="mt-1"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? (productId ? 'Updating...' : 'Creating...') : (productId ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;