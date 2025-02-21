import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Text } from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedServices, setExpandedServices] = useState({});

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://abeliasun-backend-5c08804f47f8.herokuapp.com/api/services"
        );
        setServices(response.data);
        setLoading(false);
      } catch (error) {
        setError("Erreur lors de la récupération des services");
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const toggleService = (serviceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  if (loading) {
    return (
      <div className="w-full p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Liste des Services
      </h2>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="border rounded-lg shadow-sm">
            <button
              onClick={() => toggleService(service.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg font-medium text-gray-700">
                {service.name}
              </span>
              {expandedServices[service.id] ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedServices[service.id] && service.subservices && (
              <div className="px-4 pb-4">
                <div className="pl-4 space-y-2">
                  {service.subservices.map((subservice) => (
                    <div
                      key={subservice.id}
                      className="p-2 bg-gray-50 rounded-md flex items-center"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <span className="text-gray-600">{subservice.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
