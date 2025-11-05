export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface ApiRequest {
  method: HttpMethod;
  url: string;
  headers: string;
  body: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  time: number;
  size: number;
}

export interface HistoryItem {
  id: number;
  request: ApiRequest;
}

// New Types for Connection Management
export type ConnectionType = 'PostgreSQL' | 'MongoDB' | 'Redis' | 'Milvus';

export interface PostgresDetails {
  host?: string;
  port?: string;
  user?: string;
  password?: string;
  dbname?: string;
}

export interface MongoDetails {
  uri?: string;
}

export interface RedisDetails {
  host?: string;
  port?: string;
  password?: string;
  db?: string;
}

export interface MilvusDetails {
  host?: string;
  port?: string;
}

// Fix: Changed from union (|) to intersection (&) to correctly type the collection of all possible detail fields.
export type ConnectionDetails = PostgresDetails & MongoDetails & RedisDetails & MilvusDetails;

export interface Connection {
  id: string;
  name: string;
  type: ConnectionType;
  details: ConnectionDetails;
}
