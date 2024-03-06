<script lang="ts">
	import Phaser from 'phaser';

	import { onDestroy, onMount } from 'svelte';
	import Hud from './Hud.svelte';
	import { config } from '$lib/phaser';

	let gameContainer: HTMLCanvasElement;

	let game: Phaser.Game;

	onMount(async () => {
		config.canvas = gameContainer;
		game = new Phaser.Game(config);
	});

	onDestroy(async () => {
		game.destroy(false, false);
	});
</script>

<div>
	<canvas bind:this={gameContainer} />
</div>

<Hud />
