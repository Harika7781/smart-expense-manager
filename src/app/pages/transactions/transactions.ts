import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Transaction,
  TransactionRecord,
} from '../../core/services/transaction';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {
  showForm = false;
  searchTerm = '';
  selectedType = 'all';
  selectedCategory = 'Food';

  transactions: TransactionRecord[] = [];

  constructor(private transactionService: Transaction) {}

  ngOnInit(): void {
    this.refreshTransactions();
  }

  refreshTransactions(): void {
    this.transactions = this.transactionService.getAll();
  }

  get income(): number {
    return this.transactionService.getIncome();
  }

  get expenses(): number {
    return this.transactionService.getExpenses();
  }

  get filteredTransactions(): TransactionRecord[] {
    const query = this.searchTerm.trim().toLowerCase();

    return this.transactions.filter((transaction) => {
      const matchesSearch =
        transaction.description.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query);

      const matchesType =
        this.selectedType === 'all' ||
        transaction.type === this.selectedType;

      return matchesSearch && matchesType;
    });
  }

  addTransaction(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const description = String(
      formData.get('description') ?? '',
    ).trim();

    const amount = Number(formData.get('amount'));
    const type = String(formData.get('type'));
    const category = String(formData.get('category'));

    const validCategories = [
      'Food',
      'Transport',
      'Shopping',
      'Bills',
      'Salary',
      'Education',
      'Other',
    ];

    if (
      !description ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      (type !== 'income' && type !== 'expense') ||
      !validCategories.includes(category)
    ) {
      return;
    }

    this.transactionService.add({
      description,
      amount,
      type,
      category,
    });

    this.refreshTransactions();
    form.reset();
    this.showForm = false;
  }

  deleteTransaction(id: number): void {
    this.transactionService.delete(id);
    this.refreshTransactions();
  }
}
