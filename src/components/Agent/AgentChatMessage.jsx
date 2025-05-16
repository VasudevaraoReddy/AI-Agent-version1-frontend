import React, { useState } from "react";
import { ArrowUpRight, UserCircle, Bot, Info } from "lucide-react";
import { useChatContext } from "../../context/ChatContext.jsx";
import { Tooltip } from "react-tooltip";

const AgentChatMessage = ({ message, isUser }) => {
  const { sendMessage, chatHistory, currentCSP } = useChatContext();
  const [formData, setFormData] = useState({}); // Store form field values
  const [showFormData, setShowFormData] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const wasMenuItemSelected = (menuItem) => {
    const messages = chatHistory.history || [];
    const currentMessageIndex = messages.findIndex(
      (msg) =>
        msg?.role === "assistant" &&
        (msg?.content === message ||
          (typeof msg[1] === "object" && msg[1].response === message.response))
    );

    if (
      currentMessageIndex === -1 ||
      currentMessageIndex === messages.length - 1
    ) {
      return false;
    }

    const nextMessage = messages[currentMessageIndex + 1];
    return (
      nextMessage &&
      nextMessage?.role === "human" &&
      nextMessage?.content === menuItem
    );
  };

  const handleMenuItemClick = (option) => {
    sendMessage(option);
  };

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (name, template) => {
    console.log(formData);
    sendMessage({
      message: `Deploy the Above ${name} in ${currentCSP}`,
      fields: {
        formData: formData,
        template,
      },
    });
  };

  const isDeploymentNext = () => {
    const messages = chatHistory.history || [];
    const deploymentIndex = messages.findIndex(
      (msg) =>
        msg?.role === "assistant" && msg?.content?.workflow === "deployment"
    );

    if (deploymentIndex === -1) return false;

    const maybeServiceConfigMsg = messages[deploymentIndex - 2];

    return maybeServiceConfigMsg?.content?.workflow === "serviceConfiguration";
  };

  const renderMenu = (menuItems) => {
    if (!menuItems || !menuItems.length) return null;

    return (
      <div className="mt-3">
        <p className="font-medium mb-2">Options:</p>
        <div className="flex flex-row flex-wrap gap-2">
          {menuItems.map((item, index) => {
            const isSelected = wasMenuItemSelected(item);
            return (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item)}
                disabled={isSelected}
                className={`flex cursor-pointer items-center text-left px-3 py-2 rounded-md text-sm transition-colors border 
                 ${
                   isSelected
                     ? "bg-gray-200 text-gray-700 border-gray-300 disabled:cursor-not-allowed"
                     : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                 }`}
              >
                <span>{item}</span>
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRequiredFields = (name, template, fields) => {
    if (!fields || !fields.length) return null;

    return (
      <div className="mt-3 space-y-3">
        <p className="font-medium">Required Information:</p>
        {/* {fields.map((field) => (
          <div key={field.fieldId} className="flex flex-col">
            <label className="text-sm mb-1">{field.fieldName}</label>
            <input
              type="text"
              placeholder={field.fieldName}
              value={formData[field.fieldId] || ""}
              onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        ))} */}
        {fields.map((field) => (
          <div key={field.fieldId} className="flex flex-col">
            <label className="text-sm mb-1 flex items-center gap-1">
              {field.fieldName}

              {/* Tooltip trigger */}
              <span
                id={`tooltip-trigger-${field.fieldId}`}
                className="text-gray-400 cursor-pointer"
              >
                <Info className="w-3 h-3 text-[#ccc]"/>
              </span>

              {/* Tooltip content */}
              <Tooltip
                anchorSelect={`#tooltip-trigger-${field.fieldId}`}
                place="top"
                className="!max-w-xs !text-left"
              >
                <strong>Example:</strong> {field.exampleValue}
                <br />
                {field.explanation}
              </Tooltip>
            </label>

            <input
              type="text"
              placeholder={field.exampleValue || field.fieldName}
              value={formData[field.fieldId] || ""}
              onChange={(e) => handleInputChange(field.fieldId, e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        ))}

        <button
          onClick={() => handleSubmit(name, template)}
          disabled={isDeploymentNext()}
          className={`${
            isDeploymentNext()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } px-4 py-2 rounded-md text-sm transition-colors`}
        >
          Submit
        </button>
      </div>
    );
  };

  const renderComplexMessage = (message) => {
    if (message.role === "assistant" && message.response) {
      const { response, workflow } = message;

      return (
        <div>
          <p>{response.message}</p>

          {response.availableServices && (
            <div className="mt-3">
              <p className="font-medium mb-2">Available Services:</p>
              <ul className="list-disc pl-5">
                {response.availableServices.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          )}

          {response.service?.requiredFields &&
            renderRequiredFields(
              response?.service?.name,
              response?.service?.template,
              response.service.requiredFields
            )}
          {workflow === "deployment" && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <p>You can see the deployment logs here</p>
                <button
                  className="cursor-pointer border px-2 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
                  onClick={() => setShowLogs(!showLogs)}
                >
                  Logs
                </button>
              </div>
              {showLogs && (
                <div className="text-sm text-gray-700 border border-gray-300 rounded p-2">
                  <strong>Deployment ID:</strong>{" "}
                  {response?.deploymentId || "Not available"}
                </div>
              )}

              <p>
                <button
                  className="cursor-pointer underline text-blue-600 hover:text-blue-800"
                  onClick={() => setShowFormData(!showFormData)}
                >
                  Click here
                </button>{" "}
                to see the values you sent
              </p>
              {showFormData && (
                <pre className="bg-gray-100 text-sm text-gray-800 border border-gray-300 rounded p-2 overflow-auto">
                  {JSON.stringify(response?.details || {}, null, 2)}
                </pre>
              )}
            </div>
          )}

          {response.menu && renderMenu(response.menu)}
        </div>
      );
    }

    return (
      <p>{typeof message === "string" ? message : JSON.stringify(message)}</p>
    );
  };

  return (
    <div
      className={`flex items-start gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <Bot className="w-6 h-6 mt-1 text-gray-400" />}

      <div
        className={`p-4 max-w-[80%] rounded-lg shadow-sm ${
          isUser
            ? "bg-blue-600 text-white ml-auto"
            : "bg-white text-gray-900 border border-gray-200 mr-auto"
        }`}
      >
        {isUser ? <p>{message}</p> : renderComplexMessage(message)}
      </div>

      {isUser && <UserCircle className="w-6 h-6 mt-1 text-blue-300" />}
    </div>
  );
};

export default AgentChatMessage;
