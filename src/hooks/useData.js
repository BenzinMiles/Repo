import { useState, useEffect } from 'react';

const globModules = import.meta.glob('../data/**/*.json');

export const useData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const loadedData = {};
      for (const path in globModules) {
        const module = await globModules[path]();
        const content = module.default;

        // Extract type from path if not present in content (though it should be)
        // Structure: ../data/type/file.json
        const parts = path.split('/');
        const category = parts[parts.length - 2];

        if (!loadedData[category]) {
          loadedData[category] = [];
        }
        loadedData[category].push(content);
      }
      setData(loadedData);
      setLoading(false);
    };

    loadData();
  }, []);

  const getItemsByType = (type) => {
    // Map UI types to folder names if necessary, or just search all loaded data
    // The prompt implies folders: diseases, guidelines, meds, pediatrics, tests
    // But items have a "type" field: disease, guideline, med, pediatric, quiz

    // Flatten all data
    const allItems = Object.values(data).flat();
    return allItems.filter(item => item.type === type);
  };

  const getItemById = (id) => {
    const allItems = Object.values(data).flat();
    return allItems.find(item => item.id === id);
  };

  return { data, loading, getItemsByType, getItemById };
};
