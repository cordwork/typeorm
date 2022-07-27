import { DataSource, DataSourceOptions } from 'typeorm';
import { getRepositoryToken } from './common/typeorm.utils';
import { EntityClassOrSchema } from './interfaces/entity-class-or-schema.type';
import { DataSourceStorage } from './datasource.storage';

export function createTypeOrmProviders(
  entities?: EntityClassOrSchema[],
  dataSource?: DataSource | DataSourceOptions | string,
) {
  return (entities || []).map((entity) => ({
    id: getRepositoryToken(entity, dataSource),
    useFactory: (dataSourceToken: string) => {
      const dataSource = DataSourceStorage.getDataSource(dataSourceToken);
      return dataSource.options.type === 'mongodb'
      ? dataSource.getMongoRepository(entity)
      : dataSource.getRepository(entity);
    },
    arguments: [dataSource],
  }));
}