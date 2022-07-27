import { DiscordEvent } from '@cordwork/core';


@DiscordEvent('interactionCreate')
export class InteractionController {

	async listener(interaction): Promise<void> {
		console.log('interaction', interaction);
	}

}