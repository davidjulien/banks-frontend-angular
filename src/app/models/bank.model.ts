import { Injectable } from '@angular/core';
import { Adapter } from '../adapter';

export class Bank {
  constructor(public readonly id: string, public readonly name: string) {
  }
}

@Injectable({
  providedIn: 'root',
})
export class BankAdapter implements Adapter<Bank> {
  adapt(item: any): Bank {
    return new Bank(item.id, item.name);
  }
}
