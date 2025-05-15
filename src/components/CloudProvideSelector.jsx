import { Cloud, Server, Database } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCSP } from "../features/conversations/conversationsSlice";


const CloudProviderSelector = ({ onSelect }) => {
  const dispatch = useDispatch();
  const conversationState = useSelector((state) => state?.conversationState)
  
  const handleSelect = (provider) => {
    dispatch(setCSP(provider));
    onSelect(provider);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-center mb-4">Choose a Cloud Provider</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CloudProviderCard
          name="AWS"
          color="cloud-blue"
          icon={<Cloud className="h-12 w-12 animate-float" />}
          selected={conversationState?.csp === "aws"}
          onClick={() => handleSelect("aws")}
        />
        <CloudProviderCard
          name="Azure"
          color="color-purple"
          icon={<Database className="h-12 w-12 animate-float" />}
          selected={conversationState?.csp === "azure"}
          onClick={() => handleSelect("azure")}
        />
        <CloudProviderCard
          name="GCP"
          color="cloud-green"
          icon={<Server className="h-12 w-12 animate-float" />}
          selected={conversationState?.csp === "gcp"}
          onClick={() => handleSelect("gcp")}
        />
      </div>
    </div>
  );
};

const CloudProviderCard = ({ name, color, icon, selected, onClick }) => {
  return (
    <div 
      className={`p-6 flex flex-col items-center justify-center cursor-pointer bg-white rounded-md
        ${selected ? 'ring-4 ring-offset-2 ring-' + color : 'hover:shadow-lg'}
      `}
      onClick={onClick}
    >
      <div className={`text-${color} cloud-icon`}>{icon}</div>
      <h3 className="text-xl font-medium mt-4">{name}</h3>
    </div>
  );
};

export default CloudProviderSelector;