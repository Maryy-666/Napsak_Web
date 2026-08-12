declare module "react-simple-maps" {
  import type { ComponentType, ReactNode, SVGProps } from "react";

  type Coordinates = [number, number];

  export const ComposableMap: ComponentType<
    SVGProps<SVGSVGElement> & {
      projection?: string;
      projectionConfig?: Record<string, unknown>;
      width?: number;
      height?: number;
      children?: ReactNode;
    }
  >;

  export const Geographies: ComponentType<{
    geography: string | Record<string, unknown>;
    children: (props: { geographies: Array<Record<string, unknown> & { rsmKey: string }> }) => ReactNode;
  }>;

  export const Geography: ComponentType<
    SVGProps<SVGPathElement> & {
      geography: Record<string, unknown>;
      style?: Record<string, Record<string, unknown>>;
    }
  >;

  export const Marker: ComponentType<{
    coordinates: Coordinates;
    children?: ReactNode;
  }>;
}
