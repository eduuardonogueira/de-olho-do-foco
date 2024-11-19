import styles from "./mapPoints.module.scss";
import { Point, Report } from "@customtypes/map";
import { Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import {
  CourteousIcon,
  CourteousShortIcon,
  FloodIcon,
  FloodShortIcon,
  TrashIcon,
  TrashShortIcon,
  SanitationIcon,
  SanitationShortIcon,
} from "@assets/icons";
import { useDateFormartter } from "@hooks/useDateFormatter";

const pointType = {
  sanitation: "Saneamento",
  courteous: "Desmatamento",
  trash: "Lixo",
  flood: "Alagamento",
} as const;

const PointIcons: Record<string, string> = {
  sanitation: SanitationIcon,
  courteous: CourteousIcon,
  trash: TrashIcon,
  flood: FloodIcon,
};

const PointShortIcons: Record<string, string> = {
  sanitation: SanitationShortIcon,
  courteous: CourteousShortIcon,
  trash: TrashShortIcon,
  flood: FloodShortIcon,
};

export const MapPoints = ({
  points,
  zoom,
}: {
  points?: Point[];
  zoom: number;
}) => {
  if (points && points.length > 0) {
    return (
      <>
        {points.map((point) => {
          const pinIcon = new L.Icon({
            iconUrl: PointIcons[point.type],
            iconAnchor: [0, 40],
            iconSize: [40, 40],
          });

          const pinShortIcon = new L.Icon({
            iconUrl: PointShortIcons[point.type],
            iconSize: [20, 20],
            iconAnchor: [10, 20],
          });

          const createdAt = useDateFormartter(point.createdAt);
          function translateType(type: Report): string {
            return pointType[type];
          }

          return (
            <Marker
              position={point.coordinates}
              key={point.id}
              icon={zoom <= 14 ? pinShortIcon : pinIcon}
            >
              <Tooltip>{translateType(point.type)}</Tooltip>
              <Popup>
                <h1 className={styles.pointTitle}>
                  {translateType(point.type)}
                </h1>
                {point.description ? (
                  <p>{`Descrição: ${point.description}`}</p>
                ) : (
                  ""
                )}
                <p>{`Criado em: ${createdAt}`}</p>
              </Popup>
            </Marker>
          );
        })}
      </>
    );
  }
};
