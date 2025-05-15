// import { useChatContext } from "../../context/ChatContext";

// const AgentHeader = () => {
//   const { currentCSP, setCurrentCSP } = useChatContext();

//   return (
//     <header className="bg-white border-b p-4 flex items-center justify-between">
//       <div className="flex items-center">
//         <h1 className="text-xl font-bold text-cloud-blue cursor-pointer">Cloud Studio Agent</h1>
//       </div>

//       {/* <div className="flex items-center gap-4">
//         <Select value={currentCSP} onValueChange={setCurrentCSP}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select CSP" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="aws">AWS</SelectItem>
//             <SelectItem value="azure">Azure</SelectItem>
//             <SelectItem value="gcp">GCP</SelectItem>
//           </SelectContent>
//         </Select>
//       </div> */}
//     </header>
//   );
// };

// export default AgentHeader;

import { useState } from "react";
import { useChatContext } from "../../context/ChatContext";
import { BadgeCheck } from "lucide-react";

const cloudProviders = [
  { id: "aws", name: "AWS", color: "bg-white-100" },
  { id: "azure", name: "Azure", color: "bg-white-100" },
  { id: "gcp", name: "GCP", color: "bg-white-100" },
];

const AgentHeader = () => {
  const { currentCSP, setCurrentCSP } = useChatContext();
  const [showDialog, setShowDialog] = useState(false);

  const handleSelect = (id) => {
    setCurrentCSP(id);
    setShowDialog(false);
  };

  return (
    <>
      <header className="bg-white border-b p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cloud-blue">Cloud Studio Agent Chat</h1>
        <button
          onClick={() => setShowDialog(true)}
          className="px-4 py-2 bg-yellow text-black cursor-pointer rounded-md"
        >
          Select CSP
        </button>
      </header>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">Choose Your Cloud Provider</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {cloudProviders.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => handleSelect(provider.id)}
                  className={`relative cursor-pointer p-4 rounded-lg text-center border transition-all ${currentCSP === provider.id
                      ? "border-cloud-blue ring-2 ring-cloud-blue"
                      : "border-gray-300 hover:shadow"
                    } ${provider.color}`}
                >
                  {currentCSP === provider.id && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full text-xs flex items-center justify-center">
                      <BadgeCheck className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-lg font-medium">{provider.name}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowDialog(false)}
                className="mt-2 px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentHeader;
