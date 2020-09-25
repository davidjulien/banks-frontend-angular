// This interface allows to define Adapters to transform data from API to our angular models
// Each class in models/ define an Adapter to do this transformation.
export interface Adapter<T> {
  adapt(item: any): T;
}
