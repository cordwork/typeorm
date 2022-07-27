import { DataSource } from 'typeorm';


export class DataSourceStorage {
  private static readonly storage = new Map<string, DataSource>();

  static addDataSource(
    token: string,
    dataSource: DataSource,
  ): void {
	this.storage.set(token, dataSource);
  }

  static getDataSource(
    token: string,
  ): DataSource {
    return this.storage.get(token) as DataSource;
  }
}
