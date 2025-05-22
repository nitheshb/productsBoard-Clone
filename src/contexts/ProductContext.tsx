
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Define types
export interface Feature {
  id: string;
  name: string;
  status: 'Todo' | 'In Progress' | 'Completed';
  team: string;
  progress: number;
  component_id: string;
  days?: number;
  startDate?: string;
  targetDate?: string;
  completedOn?: string;
  remarks?: string;
}

export interface Component {
  id: string; 
  name: string;
  product_id: string;
  progress: number;
  features?: Feature[];
}

export interface Product {
  id: string;
  name: string;
  progress: number;
  status?: string;
  owner?: string;
  components?: Component[];
}

interface ProductContextType {
  products: Product[];
  components: Component[];
  features: Feature[];
  teamFilter: string[];
  setTeamFilter: (teams: string[]) => void;
  availableTeams: string[];
  loading: boolean;
  filteredProducts: Product[];
  filteredComponents: Component[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [teamFilter, setTeamFilter] = useState<string[]>([]);
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([]);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch products
        const productsResponse = await supabase.from('products').select('*');
        if (productsResponse.error) throw productsResponse.error;
        const productsData = productsResponse.data || [];

        // Fetch components
        const componentsResponse = await supabase.from('components').select('*');
        if (componentsResponse.error) throw componentsResponse.error;
        const componentsData = componentsResponse.data || [];

        // Fetch features
        const featuresResponse = await supabase.from('features').select('*');
        if (featuresResponse.error) throw featuresResponse.error;
        const featuresData = featuresResponse.data || [];

        // Extract unique teams
        const teams = Array.from(new Set(featuresData.map(feature => feature.team).filter(Boolean)));

        setProducts(productsData);
        setComponents(componentsData);
        setFeatures(featuresData);
        setAvailableTeams(teams);
        setFilteredProducts(productsData);
        setFilteredComponents(componentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Apply team filter and recalculate progress
  useEffect(() => {
    applyTeamFilter();
  }, [teamFilter, products, components, features]);

  // Function to apply team filter and recalculate progress
  const applyTeamFilter = () => {
    // If no team filter is selected, show all data
    if (teamFilter.length === 0) {
      setFilteredProducts(products);
      setFilteredComponents(components);
      return;
    }

    // Filter features by selected teams
    const teamFilteredFeatures = features.filter(feature => 
      feature.team && teamFilter.includes(feature.team)
    );

    // Get components that have features from selected teams
    const componentIds = new Set(teamFilteredFeatures.map(feature => feature.component_id));
    const teamFilteredComponents = components.filter(component => componentIds.has(component.id));
    
    // Get products that have components with features from selected teams
    const productIds = new Set(teamFilteredComponents.map(component => component.product_id));
    const teamFilteredProducts = products.filter(product => productIds.has(product.id));

    // Recalculate progress for components based on team filter
    const updatedComponents = teamFilteredComponents.map(component => {
      const componentFeatures = teamFilteredFeatures.filter(
        feature => feature.component_id === component.id
      );
      
      if (componentFeatures.length === 0) {
        return component;
      }
      
      const totalProgress = componentFeatures.reduce(
        (sum, feature) => sum + (feature.progress || 0), 
        0
      );
      const avgProgress = Math.round(totalProgress / componentFeatures.length);
      
      return { ...component, progress: avgProgress };
    });

    // Recalculate progress for products based on updated components
    const updatedProducts = teamFilteredProducts.map(product => {
      const productComponents = updatedComponents.filter(
        component => component.product_id === product.id
      );
      
      if (productComponents.length === 0) {
        return product;
      }
      
      const totalProgress = productComponents.reduce(
        (sum, component) => sum + (component.progress || 0), 
        0
      );
      const avgProgress = Math.round(totalProgress / productComponents.length);
      
      return { ...product, progress: avgProgress };
    });

    setFilteredComponents(updatedComponents);
    setFilteredProducts(updatedProducts);
  };

  return (
    <ProductContext.Provider value={{
      products,
      components,
      features,
      teamFilter,
      setTeamFilter,
      availableTeams,
      loading,
      filteredProducts,
      filteredComponents
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
