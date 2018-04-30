<template>

	<div class="classvideo">

		<img class="classvideo__favorite" src="../../../assets/favorite-inactive.svg" v-show="role === 'administrator' && currentVideo.featuredGlobal === false" @click="featureGlobal($event)">
		<img class="classvideo__favorite" src="../../../assets/favorite-active.svg" v-show="role === 'administrator' &&  currentVideo.featuredGlobal === true" @click="unfeatureGlobal($event)">
		
		<img class="classvideo__favorite" src="../../../assets/favorite-inactive.svg" v-show="role === 'professor' && currentVideo.featuredClass === false" @click="featureVideo($event)">
		<img class="classvideo__favorite" src="../../../assets/favorite-active.svg" v-show="role === 'professor' && currentVideo.featuredClass === true" @click="unfeatureVideo($event)">

		<button class="classvideo__delete" v-show="role ==='administrator'" @click="toggleDeleteConfirmationModal()">Delete Video</button>

		<router-link :to="'/video/' + currentVideo.id" tag="a" class="classvideo__metadata">
				<img class="classvideo__image" :src="currentVideo.thumb">
				<div class="classvideo__titles">
					<p class="classvideo__title">{{ currentVideo.title }}</p>
					<p class="classvideo__class">{{ currentVideo.class }}</p>
					<p class="classvideo__genre">{{ secondsToMMSS(currentVideo.duration) }} / {{ genreName }} </p>
				</div>
				<div class="classvideo__metameta">
					<span class="classvideo__score">
						<p class="classvideo__scoreNum">{{ ratingAverage.toFixed(1) }}</p>
						<p class="classvideo__scoreLabel">Effectiveness</p>
					</span>
					<span class="classvideo__annotations">
						<p class="classvideo__annotationsNum">{{ numberOfAnnotations }}</p>
						<p class="classvideo__annotationsLabel">Comments</p>
					</span>
				</div>
		</router-link>

		<!-- Delete video confirmation -->
		<el-dialog :title="'!Not complete - leaves garbage in backend (annotations, collaborations, jwvideo). Use sparingly! Do you want to delete `' + currentVideo.title + '` video?'" :visible.sync="deleteModalIsOpen">
			<el-button @click="toggleDeleteConfirmationModal()">Go back</el-button>
			<el-button class="add-class-btn" @click="deleteVideo(); toggleDeleteConfirmationModal()"><strong>Delete Video</strong></el-button>
		</el-dialog>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
    import { mapMutations } from 'vuex'
    
    export default {
		props: ['currentVideo'],
		data() {
			return {
				role: this.$root.$options.authService.getAuthData().role,
				secureHTTPService : this.$root.$options.secureHTTPService,
				numberOfAnnotations: 0,
				ratingAverage: 0,
				genreName: '',
				deleteModalIsOpen: false
			}
		},
		methods: {
			toggleDeleteConfirmationModal() {
				if (this.deleteModalIsOpen) {
					this.deleteModalIsOpen = false
				}
				else {
					this.deleteModalIsOpen = true
				}
			},
			deleteVideo() {
				this.$store.dispatch("deleteVideo", this.currentVideo.id)
			},
			featureGlobal(event) {
				var eventVideoId = $(event.currentTarget).siblings()[4].getAttribute("href")
				// The string '/video/' has 7 seven characters.
				eventVideoId = eventVideoId.substring(7, eventVideoId.length)
				// console.log(eventVideoId)

				for (var i = 0, l = this.videos.length; i < l; i++) {
					if (this.videos[i].id === eventVideoId) {
							if (this.videos[i].featuredGlobal === false) {
								this.videos[i].featuredGlobal = true
								this.$store.dispatch( 'featureGlobal', this.videos[i] )
							} 
					}
				}
			},
			unfeatureGlobal(event) {
				var eventVideoId = $(event.currentTarget).siblings()[4].getAttribute("href")
				// The string '/video/' has 7 seven characters.
				eventVideoId = eventVideoId.substring(7, eventVideoId.length)
				// console.log(eventVideoId)

				for (var i = 0, l = this.videos.length; i < l; i++) {
					if (this.videos[i].id === eventVideoId) {
							if (this.videos[i].featuredGlobal === true) {
								this.videos[i].featuredGlobal = false
								this.$store.dispatch( 'unfeatureGlobal', this.videos[i] )
							} 
					}
				}
			},
			featureVideo(event) {
				var eventVideoId = $(event.currentTarget).siblings()[4].getAttribute("href")
				// The string '/video/' has 7 seven characters.
				eventVideoId = eventVideoId.substring(7, eventVideoId.length)
				// console.log(eventVideoId)

				for (var i = 0, l = this.videos.length; i < l; i++) {
					if (this.videos[i].id === eventVideoId) {
							if (this.videos[i].featuredClass === false) {
								this.videos[i].featuredClass = true
								this.$store.dispatch( 'featureVideo', this.videos[i] )
							} 
					}
				}
			},
			unfeatureVideo(event) {
				var eventVideoId = $(event.currentTarget).siblings()[4].getAttribute("href")
				// The string '/video/' has 7 seven characters.
				eventVideoId = eventVideoId.substring(7, eventVideoId.length)
				// console.log(eventVideoId)

				for (var i = 0, l = this.videos.length; i < l; i++) {
					if (this.videos[i].id === eventVideoId) {
							if (this.videos[i].featuredClass === true) {
								this.videos[i].featuredClass = false
								this.$store.dispatch( 'unfeatureVideo', this.videos[i] )
							} 
					}
				}
			},
			secondsToMMSS(s) {
				s = Number(s);

				var m = Math.floor(s % 3600 / 60);
				var s = Math.floor(s % 3600 % 60);

				return ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
			},
		},
        computed: {
            ...mapGetters(
                ['videos', 'genres']
            ),
		},
		mounted() {
			var self = this
			
			// Calculate the annotationsSum
			this.secureHTTPService.get("annotation/?videoId=" + this.currentVideo.id)
                .then(function (response) { 
					self.numberOfAnnotations =  response.data.data.length
					let ratingsSum = 0
					for (var i = 0; i < response.data.data.length; i++) {
						ratingsSum = ratingsSum + response.data.data[i].rating
					}
					if (self.numberOfAnnotations !== 0) { 
						self.ratingAverage = ratingsSum / self.numberOfAnnotations
					}
				})
				.catch(function (err) { console.log(err) })
			
			// console.log(this.genres)
			for (var i = 0; i < this.genres.length; i++) {
				// console.log(this.genres[i].id,", ", this.currentVideo.id)
				if (this.genres[i].id === this.currentVideo.genre){
					// console.log("found it")
					this.genreName = this.genres[i].name
					break
				}
			}
			// console.log(this.genreName)
		}
	}
</script>

<style>



</style>
