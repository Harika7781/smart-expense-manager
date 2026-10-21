
import { Injectable, signal } from '@angular/core';

export interface TransactionRecord {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class Transaction {
  private records = signal<TransactionRecord[]>([
    {
      id: 1,
      description: 'Monthly Salary',
      amount: 30000,
      type: 'income',
      category: 'Salary'
    },
    {
      id: 2,
      description: 'Grocery Shopping',
      amount: 2500,
      type: 'expense',
      category: 'Food'
    },
    {
      id: 3,
      description: 'Internet Bill',
      amount: 799,
      type: 'expense',
      category: 'Bills'
    },
    {
      id: 4,
      description: 'Freelance Work',
      amount: 5000,
      type: 'income',
      category: 'Other'
    },
    {
      id: 5,
      description: 'Travel Expenses',
      amount: 1200,
      type: 'expense',
      category: 'Transport'
    }
  ]);

  getAll(): TransactionRecord[] {
    return [...this.records()];
  }

  getAllSignal() {
    return this.records.asReadonly();
  }

  add(record: Omit<TransactionRecord, 'id'>): void {
    this.records.update(records => [
      { ...record, id: Date.now() },
      ...records
    ]);
  }

  delete(id: number): void {
    this.records.update(records =>
      records.filter(record => record.id !== id)
    );
  }

  getIncome(): number {
    return this.records()
      .filter(record => record.type === 'income')
      .reduce((total, record) => total + record.amount, 0);
  }

  getExpenses(): number {
    return this.records()
      .filter(record => record.type === 'expense')
      .reduce((total, record) => total + record.amount, 0);
  }

  getBalance(): number {
    return this.getIncome() - this.getExpenses();
  }
}
