import { DiscordCommand, Inject } from '@cordwork/core';
import { InjectRepository } from '../../../src/common/typeorm.decorators';
import { User } from '../entities/user.entitiy';
import { Repository } from 'typeorm';

@DiscordCommand({
	name: 'ping',
	description: 'The test command.',
	guilds: [process.env.GUILD || 'my guild name'],
})
export class CommandController {

	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
	) {}

	async listener(interaction): Promise<void> {
		const [user] = await this.userRepository.findBy({ uid: '422963304479064067' });
		interaction.reply(`Pong! by <@${user.uid}>`);
	}
}