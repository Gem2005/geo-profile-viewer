
// Type definitions for Google Maps JavaScript API 3.47
// This is a simplified version of the types for the Google Maps API

declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    panTo(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    getZoom(): number;
    fitBounds(bounds: LatLngBounds, padding?: number | Padding): void;
  }
  
  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    mapTypeId?: string;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    zoomControl?: boolean;
    styles?: any[];
  }
  
  interface LatLng {
    lat(): number;
    lng(): number;
    equals(other: LatLng): boolean;
    toJSON(): LatLngLiteral;
    toString(): string;
    toUrlValue(precision?: number): string;
  }
  
  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
  
  class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    extend(point: LatLng | LatLngLiteral): LatLngBounds;
    getCenter(): LatLng;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    isEmpty(): boolean;
    toJSON(): LatLngLiteral[];
    toString(): string;
    union(other: LatLngBounds): LatLngBounds;
  }
  
  interface Padding {
    bottom: number;
    left: number;
    right: number;
    top: number;
  }
  
  // Make Marker extend MVCObject
  class Marker extends MVCObject {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
    getMap(): Map;
    setTitle(title: string): void;
    setPosition(latLng: LatLng | LatLngLiteral): void;
    setIcon(icon: string | Icon | Symbol): void;
    setVisible(visible: boolean): void;
    addListener(eventName: string, handler: Function): MapsEventListener;
    setAnimation(animation: Animation | null): void;
  }
  
  interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | Icon | Symbol;
    animation?: Animation;
    draggable?: boolean;
    visible?: boolean;
  }
  
  interface Icon {
    url: string;
    size?: Size;
    origin?: Point;
    anchor?: Point;
    scaledSize?: Size;
  }
  
  interface Symbol {
    path: SymbolPath | string;
    fillColor?: string;
    fillOpacity?: number;
    scale?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
  }
  
  enum SymbolPath {
    BACKWARD_CLOSED_ARROW,
    BACKWARD_OPEN_ARROW,
    CIRCLE,
    FORWARD_CLOSED_ARROW,
    FORWARD_OPEN_ARROW
  }
  
  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
    equals(other: Point): boolean;
    toString(): string;
  }
  
  class Size {
    constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
    width: number;
    height: number;
    equals(other: Size): boolean;
    toString(): string;
  }
  
  enum Animation {
    BOUNCE,
    DROP
  }
  
  class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    close(): void;
    getContent(): string | Element;
    getPosition(): LatLng;
    open(map?: Map, anchor?: MVCObject | Marker): void; // Updated to accept Marker explicitly
    setContent(content: string | Element): void;
    setPosition(position: LatLng | LatLngLiteral): void;
    setZIndex(zIndex: number): void;
  }
  
  interface InfoWindowOptions {
    content?: string | Element;
    disableAutoPan?: boolean;
    maxWidth?: number;
    pixelOffset?: Size;
    position?: LatLng | LatLngLiteral;
    zIndex?: number;
  }
  
  class Geocoder {
    constructor();
    geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void;
  }
  
  interface GeocoderRequest {
    address?: string;
    bounds?: LatLngBounds;
    location?: LatLng | LatLngLiteral;
    placeId?: string;
    region?: string;
  }
  
  interface GeocoderResult {
    address_components: GeocoderAddressComponent[];
    formatted_address: string;
    geometry: GeocoderGeometry;
    place_id: string;
    types: string[];
  }
  
  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }
  
  interface GeocoderGeometry {
    location: LatLng;
    location_type: GeocoderLocationType;
    viewport: LatLngBounds;
    bounds?: LatLngBounds;
  }
  
  enum GeocoderLocationType {
    APPROXIMATE,
    GEOMETRIC_CENTER,
    RANGE_INTERPOLATED,
    ROOFTOP
  }
  
  enum GeocoderStatus {
    ERROR,
    INVALID_REQUEST,
    OK,
    OVER_QUERY_LIMIT,
    REQUEST_DENIED,
    UNKNOWN_ERROR,
    ZERO_RESULTS
  }
  
  class MVCObject {
    addListener(eventName: string, handler: Function): MapsEventListener;
    bindTo(key: string, target: MVCObject, targetKey?: string, noNotify?: boolean): void;
    get(key: string): any;
    notify(key: string): void;
    set(key: string, value: any): void;
    setValues(values: any): void;
    unbind(key: string): void;
    unbindAll(): void;
  }
  
  interface MapsEventListener {
    remove(): void;
  }
  
  namespace event {
    function addDomListener(instance: object, eventName: string, handler: Function, capture?: boolean): MapsEventListener;
    function addDomListenerOnce(instance: object, eventName: string, handler: Function, capture?: boolean): MapsEventListener;
    function addListener(instance: object, eventName: string, handler: Function): MapsEventListener;
    function addListenerOnce(instance: object, eventName: string, handler: Function): MapsEventListener;
    function clearInstanceListeners(instance: object): void;
    function clearListeners(instance: object, eventName: string): void;
    function removeListener(listener: MapsEventListener): void;
    function trigger(instance: object, eventName: string, ...args: any[]): void;
    function addListenerOnce(instance: object, eventName: string, handler: Function): MapsEventListener;
  }
}
