<template>

		<router-link class="ftdcard" tag="a" :to="'/video/' + currentVideo.id">
			<img class="ftdcard__image" :src="currentVideo.thumb" alt="Placeholder image">
			<span class="ftdcard__meta1">
				<h3 class="ftdcard__title">{{ currentVideo.title }}</h3>
				<p class="ftdcard__class">{{ currentVideo.class }}</p>
			</span>
			<span class="ftdcard__meta2">
				<p class="ftdcard__genre">{{ currentVideo.genre }}</p>
				<p class="ftdcard__date">{{ currentVideo.presentedAt | sliceDate }}</p>
			</span>
		</router-link>

</template>

<script>
	import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
    
    export default {
		props: ['currentVideo'],
        computed: {
            ...mapGetters(
                ['videos']
            ),
		},
    }
</script>

<style>

/* ==============================================
                #FEATURED-CARD
	================================================= */

	.ftdcard {
		width: 32.30%;
		margin: 0.3em;
		transition: 0.3s;
		color: #000;
		border: 1px solid #ddd;
	}

	.ftdcard:hover {
		transform: scale(1.02);
		transition: 0.3s;
	}

	.ftdcard__image {

	}

	.ftdcard__meta1 {
		display: flex;
		flex-direction: column;
		padding: 0px 10px;
	}

		.ftdcard__title {
			font-size: 14px;
			line-height: 1.5;
		}

		.ftdcard__class {
			color: #4a4a4a;
			font-size: 12px;
			margin-top: -5px;
		}

	.ftdcard__meta2 {
		display: flex;
		flex-direction: column;
		padding: 0px 10px;
		margin-top: 12px;
	}

		.ftdcard__genre {
			color: #4a4a4a;
			font-size: 12px;
		}

		.ftdcard__date {
			color: #4a4a4a;
			font-size: 12px;
			margin-top: -5px;
		}

</style>
