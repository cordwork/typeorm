import {
	DataSource,
	DataSourceOptions,
	createConnection,
} from 'typeorm';
import { EntityClassOrSchema } from './interfaces/entity-class-or-schema.type';
import { EntitiesMetadataStorage } from './entities-metadata.storage';
import {
	getDataSourceName,
	getDataSourceToken,
} from './common/typeorm.utils';
import { DEFAULT_DATA_SOURCE_NAME } from './typeorm.constants';
import { createTypeOrmProviders } from './typeorm.providers';
import { DataSourceStorage } from './datasource.storage';

export class TypeOrmModule {

	static forRoot(options: DataSourceOptions) {
		return {
			id: getDataSourceToken(options),
			useFactory: async () => await this.createDataSourceFactory(options),
		};
	}

	static forFeature(
		entities: EntityClassOrSchema[] = [],
		dataSource:
		| DataSource
		| DataSourceOptions
		| string = DEFAULT_DATA_SOURCE_NAME,
	  ) {
		const providers = createTypeOrmProviders(entities, dataSource);
		EntitiesMetadataStorage.addEntitiesByDataSource(dataSource, [...entities]);
		return {
		  imports: providers,
		};
	  }

	private static async createDataSourceFactory(
		options: DataSourceOptions,
	) {
		const dataSourceToken = getDataSourceName(options);
		const createTypeormDataSource =
			((options: DataSourceOptions) => {
				return DataSource === undefined
				? createConnection(options)
				: new DataSource(options);
			});

        let entities = options.entities;
        if (Array.isArray(entities)) {
          entities = entities.concat(
            EntitiesMetadataStorage.getEntitiesByDataSource(dataSourceToken),
          );
        } else {
          entities =
            EntitiesMetadataStorage.getEntitiesByDataSource(dataSourceToken);
        }
        const dataSource = await createTypeormDataSource({
          ...options,
          entities,
        });
		DataSourceStorage.addDataSource(dataSourceToken, dataSource);

        // TODO: remove "dataSource.initialize" condition (left for backward compatibility)
        return (dataSource as any).initialize && !dataSource.isInitialized
          ? dataSource.initialize()
          : dataSource;
	}

}