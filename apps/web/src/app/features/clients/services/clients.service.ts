import { Injectable, signal } from '@angular/core';
import { Client } from '../models/clients-table.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private clientsSignal = signal<Client[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8900',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234 567 8901',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1 234 567 8902',
      status: 'Inactive',
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      phone: '+1 234 567 8903',
      status: 'Active',
    },
  ]);

  readonly clients = this.clientsSignal.asReadonly();

  addClient(client: Omit<Client, 'id'>): void {
    const newClient: Client = {
      ...client,
      id: this.generateId(),
    };

    this.clientsSignal.update((clients) => [...clients, newClient]);
  }

  updateClient(id: number, updates: Partial<Client>): void {
    this.clientsSignal.update((clients) =>
      clients.map((client) =>
        client.id === id ? { ...client, ...updates } : client
      )
    );
  }

  deleteClient(id: number): void {
    this.clientsSignal.update((clients) =>
      clients.filter((client) => client.id !== id)
    );
  }

  private generateId(): number {
    const currentClients = this.clientsSignal();
    return currentClients.length > 0
      ? Math.max(...currentClients.map((c) => c.id)) + 1
      : 1;
  }
}
