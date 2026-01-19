import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { Loader2 } from 'lucide-react';

import DiseaseRenderer from '../components/DiseaseRenderer';
import GuidelineRenderer from '../components/GuidelineRenderer';
import MedicationRenderer from '../components/MedicationRenderer';
import PediatricRenderer from '../components/PediatricRenderer';
import QuizRenderer from '../components/QuizRenderer';

const DetailView = () => {
  const { id } = useParams();
  const { getItemById, loading } = useData();

  const item = getItemById(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Item not found.</p>
      </div>
    );
  }

  switch (item.type) {
    case 'disease':
      return <DiseaseRenderer data={item} />;
    case 'guideline':
      return <GuidelineRenderer data={item} />;
    case 'med':
      return <MedicationRenderer data={item} />;
    case 'pediatric':
      return <PediatricRenderer data={item} />;
    case 'quiz':
      return <QuizRenderer data={item} />;
    default:
      return (
        <div className="text-center py-12">
          <p className="text-red-500">Unknown content type: {item.type}</p>
        </div>
      );
  }
};

export default DetailView;
