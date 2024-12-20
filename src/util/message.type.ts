export interface ApiMessageData<T> {
  id: number;
  type: string;
  endpoint: string;
  data?: T;
}
