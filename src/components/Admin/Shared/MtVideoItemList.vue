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
					<span v-if="enableStatistics" class="classvideo__score" @click.stop.prevent @click="openModalCanonChart()">
						<p class="classvideo__scoreNum">{{ ratingAverage.toFixed(1) }}</p>
						<p class="classvideo__scoreLabel">Effectiveness</p>
					</span>
					<span v-if="!enableStatistics" class="classvideo__scoreNoHover">
						<p class="classvideo__scoreNum">{{ ratingAverage.toFixed(1) }}</p>
						<p class="classvideo__scoreLabel">Effectiveness</p>
					</span>
					<span class="classvideo__annotations">
						<p class="classvideo__annotationsNum">{{ numberOfAnnotations }}</p>
						<p class="classvideo__annotationsLabel">Comments</p>
					</span>
				</div>
		</router-link>

		<!-- Canon statistics modal -->
		<el-dialog :title="currentVideo.title" :visible.sync="modalCanonChartIsOpen">
			<!-- <img :src="currentVideo.thumb" width="60%"> -->
			<!-- Loading -->
				<div class="uploadvid__sync-load" 
					v-loading="loadingModalCanonChart" 
					v-show="loadingModalCanonChart"
					element-loading-text="Loading..." 
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"><br><br><br><br><br></div>
			<ve-histogram v-if="!loadingModalCanonChart" :data="chartData" :extend="chartExtend" :settings="chartSettings"></ve-histogram>
			<el-table v-if="!loadingModalCanonChart" :data="canonInfo" style="width: 100%">
				<el-table-column prop="canon" label="Canon" >
				</el-table-column>
				<el-table-column prop="annotationCount" label="Total # of annotations">
				</el-table-column>
			</el-table>
		</el-dialog>

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
		props: ['currentVideo', 'enableStatistics'],
		data() {
			return {
				role: this.$root.$options.authService.getAuthData().role,
				secureHTTPService : this.$root.$options.secureHTTPService,
				numberOfAnnotations: 0,
				ratingAverage: 0,
				genreName: '',
				deleteModalIsOpen: false,
				modalCanonChartIsOpen: false,
				chartData: {
					columns: ['canon', 'averageRating'],
					rows: []
                },
                chartSettings: { 
					yAxisType: 'value',
					min: [0],
					max: [5]
				},
				chartExtend: { series: {} },
				canonInfo: [], // Helper array for v-chart array: chartData.rows[]
				loadingModalCanonChart: false
			}
		},
		methods: {
			openModalCanonChart() {
				var self = this
				this.modalCanonChartIsOpen = true
				this.loadingModalCanonChart = true

				this.$store.dispatch('getVideoAnnotations', this.currentVideo.id)
					.then(function ()
					{
						self.loadingModalCanonChart = false
						self.canonAverageRating(self.videoAnnotations)						
					})

			},
			// TODO
			canonAverageRating(annotations) {
				this.canonInfo = []
				this.chartData.rows = []
				var found = false
				for (var i = 0; i < annotations.length; i++) {
					for (var j = 0; j < this.canonInfo.length; j++) {
						if (annotations[i].canon === this.canonInfo[j].canon) {
							console.log(annotations[i].canon)
							found = true
							this.canonInfo[j].sumRating = this.canonInfo[j].sumRating + annotations[i].rating
							this.canonInfo[j].annotationCount++
						} 
					}
					if (found === false) {
						this.canonInfo.push({ canon: annotations[i].canon, sumRating: annotations[i].rating, annotationCount: 1 })
					}
					found = false
				}
				for (var i = 0; i < this.canonInfo.length; i++) {
					this.chartData.rows.push({ canon: this.canonInfo[i].canon, averageRating: this.canonInfo[i].sumRating / this.canonInfo[i].annotationCount })
				}
				
				// Order the chartData.rows array by canon name.
				const CANON_ORDER = ['Invention', 'Structure', 'Delivery', 'Visuals', 'Style']
				const newChartDataOrder = []
				for (var i = 0; i < CANON_ORDER.length; i++) {
					for (var j = 0; j < this.chartData.rows.length; j++) {
						if (this.chartData.rows[j].canon === CANON_ORDER[i]) {
							newChartDataOrder.push(this.chartData.rows[j])
						}
					}
				}

				// this.chartData.rows = []
				// for (var i = 0; i < newChartDataOrder.length; i++) {
				// 	this.chartData.rows.push(newChartDataOrder[i])
				// }

				// Fills the bars with the desired colors.
				const CANONS_COLOR_LIST = []
				for (var i = 0; i < this.canonInfo.length; i++) {
					if (this.canonInfo[i].canon === 'Invention') CANONS_COLOR_LIST.push('#15314F')
					else if (this.canonInfo[i].canon === 'Structure') CANONS_COLOR_LIST.push('#F2992E')
					else if (this.canonInfo[i].canon === 'Delivery') CANONS_COLOR_LIST.push('#39A0ED')
					else if (this.canonInfo[i].canon === 'Visuals') CANONS_COLOR_LIST.push('#717C89')
					else if (this.canonInfo[i].canon === 'Style') CANONS_COLOR_LIST.push('#38C97C')
				}
				this.chartExtend = { // The chartExtend object is passed as a parameter to the ve-histogram element.
					series (item) {
						item[0].data = item[0].data.map((v, index) => ({
							value: v,
							itemStyle: { color: CANONS_COLOR_LIST[index] },
						}))
						return item
					}
				}

            },
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
                ['videos', 'genres', 'videoAnnotations']
            ),
		},
		created() {
			// const CANONS_COLOR_LIST = ['#15314F', '#F2992E', '#39A0ED', '#717C89', '#38C97C']

			// this.chartExtend = {
			// 	series: [
			// 	  { itemStyle: {color: '#15314F '}, value: 5 },
			// 	  { itemStyle: {color: 'yellow '}, value: 4 },
			// 	  { itemStyle: {color: 'blue '}, value: 3 },
			// 	]
			// }

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
			
			for (var i = 0; i < this.genres.length; i++) {
				if (this.genres[i].id === this.currentVideo.genre){
					this.genreName = this.genres[i].name
					break
				}
			}
		}
	}
</script>

<style>

	.classvideo {
		display: flex;
		padding: 17px 10px;
		border-bottom: 1px solid #efefef;
	} 
			.classvideo:hover	{
				background-color: #F5F5F5;
			}

				.classvideo__favorite {
					width: 30px;
					height: 60px;
				}

				.classvideo__delete {
					/* KOSTAS */
					margin-top: 0;
					padding-top: 0;
					margin-bottom: 3px;
					font-size:12px;
					height: 60px;
					margin-left: 10px;
				}
				.classvideo__metadata {
					display: flex;
					justify-content: space-between;
					margin-left: 20px;
					width: 100%;
					/* KOSTAS */
					text-decoration: none; 
					color: black; 
				}

					.classvideo__image {
						display: flex;
						width: 200px;
						height: 60px;
					}

					.classvideo__titles {
						width: 100%;
						margin-left: 15px;
					}
							.classvideo__title {
								color: #4a4a4a;
								font-weight: 600;
								font-size: 18px;
							}
							.classvideo__class {
								margin-top: 6px;
								font-size: 14px;
							}
							.classvideo__genre {
								margin-top: -4px;
								font-size: 14px;
							}

					.classvideo__metameta {
						display: flex;
						margin-left: 15px;
					}

						.classvideo__score {
							background-color:#89a9c0; 
							color: #fff;
							padding: 0px 8px;
							display: flex;
							flex-direction: column;
							justify-content: center;
							border-radius: 4px;
							margin-top: 10px;
							cursor: help;
						}
						.classvideo__score:hover {
							background-color: #6d8799;
						}
								.classvideo__scoreNum {
									font-weight: 600;
									font-size: 1.8em;
									height: 50%;
									margin-top: 10px;
									text-align: center;
								}
								.classvideo__scoreLabel {
									font-size: 0.8em;
									text-align: center;
									height: 50%;
								}
						.classvideo__scoreNoHover {
							background-color:#89a9c0; 
							color: #fff;
							padding: 0px 8px;
							display: flex;
							flex-direction: column;
							justify-content: center;
							border-radius: 4px;
							margin-top: 10px;
							cursor: help;
						}
								.classvideo__scoreNoHoverNum {
									font-weight: 600;
									font-size: 1.8em;
									height: 50%;
									margin-top: 10px;
									text-align: center;
								}
								.classvideo__scoreNoHoverLabel {
									font-size: 0.8em;
									text-align: center;
									height: 50%;
								}
							
						.classvideo__annotations {
							margin-top: 10px;
							margin-left: 10px;
							background-color:#89a9c0; 
							color: #fff;
							padding: 0px 8px;
							display: flex;
							flex-direction: column;
							justify-content: center;
							border-radius: 4px;
						}
								.classvideo__annotationsNum {
									font-weight: 600;
									font-size: 1.8em;
									text-align: center;
									height: 50%;
									margin-top: 10px;
								}
								.classvideo__annotationsLabel {
									font-size: 0.8em;
									text-align: center;
									height: 50%;
								}

</style>
