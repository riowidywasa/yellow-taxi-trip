import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Popup, Marker } from "react-leaflet";
import axios from "axios";
import { useForm } from "react-hook-form";
import moment from "moment";
import LoadingScreen from "./LoadingScreen";
import InputField from "../ui/InputField";
import { FilterValues, TaxiData } from "../Interface";
import L from "leaflet";

const pickupIcon = new L.Icon({
  iconUrl: "/taxi.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const dropoffIcon = new L.Icon({
  iconUrl: "/location.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const TaxiMap: React.FC = () => {
  const [taxiData, setTaxiData] = useState<TaxiData[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FilterValues>();
  const [isLoading, setIsLoading] = useState(false);

  const api_url = import.meta.env.VITE_API_URL;

  const fetchTaxiData = async (filters: FilterValues) => {
    setIsLoading(true);
    try {
      const formattedStartTime = filters.startTime
        ? moment(filters.startTime).toISOString()
        : undefined;
      const formattedEndTime = filters.endTime ? moment(filters.endTime).toISOString() : undefined;

      const params: FilterValues = {
        startTime: formattedStartTime as string,
        endTime: formattedEndTime as string,
        minFare: filters.minFare,
        maxFare: filters.maxFare,
        minTripDistance: filters.minTripDistance,
        maxTripDistance: filters.maxTripDistance,
        paymentType: filters.paymentType,
      };

      const response = await axios.get(`${api_url}/api/taxi`, { params });
      setTaxiData(response.data);
    } catch (error) {
      console.error("Failed to fetch taxi data:", error);
    }
    setIsLoading(false);
  };

  const onSubmit = (filters: FilterValues) => {
    const hasAtLeastOneFilter = Object.values(filters).some(
      (value) => value !== undefined && value !== ""
    );
    if (!hasAtLeastOneFilter) {
      alert("Please fill in at least one filter.");
      return;
    }

    const { startTime, endTime } = filters;
    if (
      (startTime && !moment(startTime).isBetween("2014-01-01", "2014-12-31", "day", "[]")) ||
      (endTime && !moment(endTime).isBetween("2014-01-01", "2014-12-31", "day", "[]"))
    ) {
      alert("Please select dates within the year 2014.");
      return;
    }

    fetchTaxiData(filters);
  };

  const resetMap = () => {
    reset(); 
    setTaxiData([]); 
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-100">

      <div className="w-full max-w-lg bg-white p-8 shadow-lg rounded-xl overflow-y-auto h-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          NYC Yellow Taxi Data (2014)
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            label="Start Time (2014 only)"
            type="datetime-local"
            name="startTime"
            register={register}
            min="2014-01-01T00:00"
            max="2014-12-31T23:59"
            required
            error={errors.startTime ? "Start time is required" : ""}
          />
          <InputField
            label="End Time (2014 only)"
            type="datetime-local"
            name="endTime"
            register={register}
            min="2014-01-01T00:00"
            max="2014-12-31T23:59"
            required
            error={errors.endTime ? "End time is required" : ""}
          />
          <InputField
            label="Min Fare"
            type="number"
            name="minFare"
            register={register}
            step="0.01"
            required
            error={errors.minFare ? "Min fare is required" : ""}
          />
          <InputField
            label="Max Fare"
            type="number"
            name="maxFare"
            register={register}
            step="0.01"
            required
            error={errors.maxFare ? "Max fare is required" : ""}
          />
          <InputField
            label="Min Trip Distance"
            type="number"
            name="minTripDistance"
            register={register}
            step="0.01"
            required
            error={errors.minTripDistance ? "Min trip distance is required" : ""}
          />
          <InputField
            label="Max Trip Distance"
            type="number"
            name="maxTripDistance"
            register={register}
            step="0.01"
            required
            error={errors.maxTripDistance ? "Max trip distance is required" : ""}
          />
          <InputField
            label="Payment Type"
            type="select"
            name="paymentType"
            register={register}
            options={["", "CRD", "CSH"]}
            optionLabels={["All", "Credit Card", "Cash"]}
            error={errors.paymentType ? "Payment type is required" : ""}
          />

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={resetMap}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Reset Map
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1">
        <MapContainer center={[40.7128, -74.006]} zoom={12} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {taxiData.map((trip, index) => (
            <React.Fragment key={index}>
              <Polyline
                positions={[
                  [trip.pickup_latitude, trip.pickup_longitude],
                  [trip.dropoff_latitude, trip.dropoff_longitude],
                ]}
                color="blue"
                weight={3}
              >
                <Popup>
                  <div>
                    <p>
                      <strong>Fare:</strong> ${Number(trip.fare_amount).toFixed(2)}
                    </p>
                    <p>
                      <strong>Distance:</strong> {Number(trip.trip_distance).toFixed(2)} miles
                    </p>
                    <p>
                      <strong>Payment:</strong> {trip.payment_type}
                    </p>
                    <p>
                      <strong>Pickup Time:</strong> {moment(trip.pickup_datetime).format("LLL")}
                    </p>
                    <p>
                      <strong>Drop Time:</strong> {moment(trip.drop_datetime).format("LLL")}
                    </p>
                  </div>
                </Popup>
              </Polyline>

              <Marker position={[trip.pickup_latitude, trip.pickup_longitude]} icon={pickupIcon}>
                <Popup>Pickup Location</Popup>
              </Marker>

              <Marker position={[trip.dropoff_latitude, trip.dropoff_longitude]} icon={dropoffIcon}>
                <Popup>Dropoff Location</Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default TaxiMap;
