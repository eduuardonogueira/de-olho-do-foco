import styles from "./myMap.module.scss";
import {
  Circle,
  Marker,
  Polyline,
  Popup,
  Tooltip,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import { TileLayer } from "react-leaflet/TileLayer";
import pinSvg from "@assets/icons/pin.svg";
import cursorSvg from "@assets/icons/cursor.svg";
import L from "leaflet";
import { Area, Point } from "@customtypes/map";
import useUserLocation from "@hooks/useUserLocation";
import { useState } from "react";

interface MapProps {
  className?: string;
  points?: Point[];
  areas?: Area[];
}

export const MyMap = ({ className, points, areas }: MapProps) => {
  const map = useMapEvents({
    zoomstart() {
      setZoom(map.getZoom());
      console.log(zoom)
    },
  });

  const API_KEY = import.meta.env.VITE_API_MAPS;
  const { userLocation } = useUserLocation();
  const [zoom, setZoom] = useState<number>(15);

  const pinIcon = new L.Icon({
    iconUrl: pinSvg,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
  });

  const CursorIcon = new L.DivIcon({
    html: `<img src="${cursorSvg}" style="transform: rotate(${
      userLocation?.rotation || 0
    }deg); width: 50px; height: 50px;" />`,
    iconSize: [50, 50],
    className: styles.cursorIcon,
  });

  return (
    <>
      <TileLayer
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors'
        url={`https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=${API_KEY}`}
        id="osm-bright"
        className={className}
      />
      <ZoomControl position="bottomleft" />

      {!userLocation ? (
        ""
      ) : (
        <>
          <Marker position={userLocation.coordinates} icon={CursorIcon} />
          {zoom <= 15 ? (
            ""
          ) : (
            <Circle
              center={userLocation.coordinates}
              pathOptions={{ color: "#fff", fillColor: "#0004FF" }}
              radius={150}
            />
          )}
        </>
      )}

      {!points || points.length === 0
        ? ""
        : points.map((point) => (
            <Marker
              position={point.coordinates}
              key={point.type}
              icon={point.icon}
            >
              <Popup>
                {point.type}
                <Tooltip>{point.description}</Tooltip>
                <Tooltip>{point.createdAt.toISOString()}</Tooltip>
              </Popup>
            </Marker>
          ))}
      {!areas || areas.length === 0
        ? ""
        : areas.map((area, index) => (
            <Polyline
              key={index}
              positions={area.coordinates}
              pathOptions={area.pathOptions}
            />
          ))}
    </>
  );
};

export default MyMap;