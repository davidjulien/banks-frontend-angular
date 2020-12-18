/*
 * Updated from https://github.com/Yasin21/infinite-pagination-rxjs/blob/master/src/app/helper/infinite-scroll-data.adapter.ts
 * Class is tested through src/app/components/transactions-list/transactions-list.component.spec.ts
 */
import {BehaviorSubject, combineLatest, Observable, PartialObserver, Subscribable, Unsubscribable} from 'rxjs';
import {map, scan, switchMap, tap} from 'rxjs/operators';


export class PaginatedData<T> {
  public data: T[];
  public nextCursor: string;
  public total: number;

  constructor(data: T[], nextCursor: string, total: number) {
    this.data = data;
    this.nextCursor = nextCursor;
    this.total = total;
  }
}

export class InfiniteScrollDataAdapter implements Subscribable<any>{
  pDataSource$: Observable<any>;

  // Loading state as observable
  public loading$ = new BehaviorSubject(false);

  // if you can load more element....
  public hasMore$ = new BehaviorSubject(true);

  // Total Count Observable
  public totalCount$ = new BehaviorSubject(0);

  // Current cursor as observable
  private pCursor$ = new BehaviorSubject(null);

  // Current limit as observable
  private limit$: BehaviorSubject<any>;

  // Cursor for next API call
  private nextCursor: string;

  /***
   *
   * @param pDataSource Give a function that returns observable on PaginatedData
   * @param _limit limit per fetch
   */
  constructor(private pDataSource: (cursor, limit) => Observable<any>, limitValue: number) {
    // Set The limit into an observable ...
    this.limit$ = new BehaviorSubject(limitValue);
    // Load Data source....
    this.pDataSource$  = combineLatest([this.pCursor$, this.limit$]) // If cursor or limit is updated
      .pipe(
        // Loading On
        tap(() => this.loading$.next(true)),

        // Load Data from data source
        switchMap(([cursor, limit]) =>
          this.pDataSource(cursor, limit).pipe(
            map((data) => {
              return {data, cursor, limit};
            })
          )),
        // Set hasMore$, totalCount$ ...
        tap(({data, cursor, limit}) => {
          this.nextCursor = data.nextCursor;
          this.hasMore$.next(this.nextCursor != null);
          this.totalCount$.next(data.total);
        }),
        // Accumulate data into 1 array
        scan((acc, {data, cursor, limit}) => {
          // if cursor is null (first call) THEN
          return cursor == null ?
            // reset the data counter
            data.data :
            // Put the data at the current list
            [...acc, ...data.data];
        }, []),

        // Turn off loading
        tap(() => this.loading$.next(false))
      );
  }

  subscribe(observer?: PartialObserver<any>): Unsubscribable;
  subscribe(next: null | undefined | ((value: any) => void), error: null | undefined, complete: () => void): Unsubscribable;
  subscribe(next: null | undefined, error: (error: any) => void, complete?: () => void): Unsubscribable;
  subscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable;
  subscribe(
    observer?: PartialObserver<any> | null | undefined | ((value: any) => void), error?: null | undefined | ((error: any) => void),
    complete?: () => void): Unsubscribable {
    return this.pDataSource$.subscribe(...arguments);
  }

  /**
   * This method will allow you to reload the list
   */
  reload(): void {
    this.pCursor$.next(null);
  }

  /**
   * This method will allow you load more in the list
   */
  loadMore(): void {
    if (this.loading$.getValue() || this.nextCursor === null) {
      return;
    }
    this.pCursor$.next(this.nextCursor);
  }
}
