import { useState, useEffect } from "react";
import { Cloud, CloudLightning, CloudSun, CloudDrizzle } from "lucide-react";
import CloudProviderSelector from "./CloudProvideSelector";
import ChatContainer from "./ChatContainer";

const HomePage = () => {
    const [cloudProvider, setCloudProvider] = useState(null);

    const handleCloudProviderSelect = (provider) => {
        setCloudProvider(provider);
        if (provider) {
            localStorage.setItem("cloudWhispererProvider", provider);
        }
    };

    return (
        <div className="main-bg">
            <header className="w-full max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-4 mb-2 p-2">
                    <Cloud className="h-8 w-8 text-cloud-blue animate-float" />
                    <h1 className="text-4xl font-bold text-gradient">
                        Cloud Studio
                    </h1>
                </div>
                <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto">
                    Your AI-powered cloud engineering assistant for AWS, Azure, and GCP
                </p>
            </header>

            {!cloudProvider ? (
                <CloudProviderSelector onSelect={handleCloudProviderSelect} />
            ) : (
                <ChatContainer cloudProvider={cloudProvider} />
            )}

            <footer className="mt-auto pt-8 text-center text-sm text-gray-500">
                <p>© 2025 Cloud Studio - Powered by AI</p>
            </footer>
        </div>
    );
};

export default HomePage;