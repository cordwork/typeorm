import { Module } from '@cordwork/core';
import { ReadyController } from './controllers/ready.controller';
import { InteractionController } from './controllers/interaction.controller';
import { CommandController } from './controllers/command.controller';
import { TypeOrmModule } from '../../src/typeorm.module';
import { User } from './entities/user.entitiy';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			"type": "mongodb",
			"host": "localhost",
			"port": 27017,
			"synchronize": true,
			"database": "knight",
			"useUnifiedTopology": true,
			"entities": [
				"./entities/**/*.ts"
			],
		}),
		TypeOrmModule.forFeature([
			User,
		]),
	],
	events: [ReadyController, InteractionController],
	commands: [CommandController],
})
export class App {

}