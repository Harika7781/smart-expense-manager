import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showAddForm = false;

  transactions: Transaction[] = [
    { id: 1, description: 'Monthly Salary', amount: 30000, type: 'income' },
    { id: 2, description: 'Groceries', amount: 2500, type: 'expense' },
    { id: 3, description: 'Internet Bill', amount: 799, type: 'expense' },
    { id: 4, description: 'Freelance Work', amount: 5000, type: 'income' }
  ];

  get income(): number {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get expenses(): number {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get balance(): number {
    return this.income - this.expenses;
  }

  addTransaction(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const description = String(data.get('description') ?? '').trim();
    const amount = Number(data.get('amount'));
    const type = String(data.get('type'));

    if (
      !description ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      (type !== 'income' && type !== 'expense')
    ) {
      return;
    }

    this.transactions = [
      {
        id: Date.now(),
        description,
        amount,
        type
      },
      ...this.transactions
    ];

    form.reset();
    this.showAddForm = false;
  }
}