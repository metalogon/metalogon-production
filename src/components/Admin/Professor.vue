	<template>

			<div class="professor">

				<my-header></my-header>
				
				<div class="professor__body columns">

					<div class="professor__main column is-10">

						<div class="featured">
							<h3 class="featured__heading">Featured videos of {{ currentClassSelected }}</h3>
							<div class="featured__container">
								<mt-video-card v-for="v in videos" v-bind:key="v.id" :currentVideo="v" v-if="(currentClassSelected !== 'Home' && v.class === currentClassSelected && v.featuredClass === true) || (currentClassSelected === 'Home' && v.featuredGlobal === true)">
								</mt-video-card>
							</div>
						</div>

						<div class="professor__classvideos" v-show="!(currentClassSelected === 'Home')">
							<h3 class="class__heading"> {{ currentClassNumber }} - {{ currentClassSelected }}
							</h3>
							<mt-video-itemlist v-for="v in videos" v-bind:key="v.id" :currentVideo="v" v-if="v.class === currentClassSelected"></mt-video-itemlist>
						</div>

						<upload-video :currentClassProp="currentClassSelected"></upload-video>

					</div>

					<mt-sidebar></mt-sidebar>

				</div>
				
				<my-footer></my-footer>	

				<!-- <el-dialog title="Genre customization" :visible.sync="modalGenreCustomization" size="large">
						<h3 style="margin-bottom:10px;">Choose genre:</h3>
						<el-select v-model="currentGenre" placeholder="Choose a genre">
							<el-option v-for="g in genres" :key="g.name" :label="g.name" :value="g.name"></el-option>
						</el-select>

						<el-radio class="radio" v-model="currentGenre" v-for="g in genres" :key="g.name" :label="g.name"></el-radio>

						<br/>
						<br/>
						<p>Choose canons:</p>
						<el-tree :data="canons" :props="genreProps" @node-click="handleNodeClick" show-checkbox>
						</el-tree>
						
						<span slot="footer" class="dialog-footer">
								<el-button @click="modalGenreCustomization = false">Close</el-button>
						</span>
				</el-dialog>	

				<el-dialog title="Genre customization" :visible.sync="modalGenreCustomization2" size="large">
						<h3 style="margin-bottom:10px;">Choose genre:</h3>
						<el-select v-model="currentGenre" placeholder="Choose a genre">
							<el-option v-for="g in genres" :key="g.name" :label="g.name" :value="g.name"></el-option>
						</el-select>
						<br/>
						<br/>
						<p style="font-weight:700; margin-top:10px;">STRUCTURE</p>
						<el-transfer v-model="structurePassed" :data="structureData" :titles="['Disabled', 'Enabled']">
						</el-transfer>
						<p style="font-weight:700; margin-top:10px;">DELIVERY</p>
						<el-transfer v-model="deliveryPassed" :data="deliveryData" :titles="['Disabled', 'Enabled']">
						</el-transfer>
						<p style="font-weight:700; margin-top:10px;">STYLE</p>
						<el-transfer v-model="stylePassed" :data="styleData" :titles="['Disabled', 'Enabled']">
						</el-transfer>
						<p style="font-weight:700; margin-top:10px;">VISUALS</p>
						<el-transfer v-model="visualsPassed" :data="visualsData" :titles="['Disabled', 'Enabled']">
						</el-transfer>
						
						<span slot="footer" class="dialog-footer">
								<el-button @click="modalGenreCustomization2 = false">Close</el-button>
						</span>
				</el-dialog>	 -->
				
			</div>	

	</template>

<script>
	import _ from 'lodash'
	import { mapGetters } from 'vuex'
	import { mapMutations } from 'vuex'
	import UploadVideo from '../Extra/UploadVideo.vue'
	import MyHeader from '../Layout/MyHeader.vue'
	import MtSidebar from './Shared/MtSidebar.vue'
	import MyFooter from '../Layout/MyFooter.vue'
	import MtVideoCard from './Shared/MtVideoCard.vue'
	import MtVideoItemList from './Shared/MtVideoItemList.vue'

	export default {
		data() {
			return {
				modalGenreCustomization: false,
				modalGenreCustomization2: false,
				genres: [
					{ name: 'Elevator pitch' },
					{ name: 'Lab presentation' },
					{ name: 'Thesis talk' },
					{ name: 'Progress report' },
					{ name: 'Conference talk' }
				],
				currentGenre: 'Lab presentation',
				// Genre version 1
				canons: [
					{
						label: 'Moves',
						children: [
							{ label: 'Introduction', children: [
								{ label: 'Shows that the research area is important/central/interesting/problematic/relevant and narrows down to the topic of the research' },
								{ label: 'States the value of the present research and explains why it was conducted' },
								{ label: 'Discusses the definitions of key terms' },
								{ label: 'Summarizes and previews the methods used' },
								{ label: 'Presents basic equations' },
							]},
							{ label: 'Methodology', children: [
								{ label: 'Describes materials and instrumentation in the study' },
								{ label: 'Describes tasks (actions) in the study' },
								{ label: 'Describes the procedures of an experiment (activities)' },
								{ label: 'Presents justification of techniques' },
								{ label: 'Describes variables in the study' },
								{ label: 'Describes the procedures used in data analysis' },
								{ label: 'Describes the relations between the experiment and prior/subsequent experiments' },
							]},
							{ label: 'Results and Discussion', children: [
								{ label: 'Shows that the research area is important/central/interesting/problematic/relevant and narrows down to the topic of the research' },
								{ label: 'States the value of the present research and explains why it was conducted' },
								{ label: 'Discusses the definitions of key terms' },
								{ label: 'Summarizes and previews the methods used' },
								{ label: 'Presents basic equations' },
							]},
							{ label: 'Conclusion', children: [
								{ label: 'xxxxxxxxxx' },
							]},
							{ label: 'Question and Answer', children: [
								{ label: 'xxxxxxxxxx' },
							]},
						]
					}, 
					{
						label: 'Structure',
						children: [
							{ label: 'Terms', desc: 'Provides overview of the talk, emphasizing the connection between key terms and concepts'},
							{ label: 'Conceptual transitions' },
							{ label: 'Line of argument' },
							{ label: 'Central moves' },
						]
					}, 
					{
						label: 'Delivery',
						children: [
							{ label: 'Volume' },
							{ label: 'Gestures' },
							{ label: 'Metadiscourse' },
							{ label: 'Posture' },
							{ label: 'Language' },
						]
					}, 
					{
						label: 'Style',
						children: [
							{ label: 'Coherence' },
							{ label: 'Concision' },
							{ label: 'Flow' },
							{ label: 'Emphasis' },
							{ label: 'Figures of Speech' },
							{ label: 'Figures of Sound' },
						]
					},
					{
						label: 'Visuals',
						children: [
							{ label: 'Pictorial cues' },
							{ label: 'Slide titles' },
							{ label: 'Image-text highlight' },
							{ label: 'Graphics' },
							{ label: 'Memorable images' }
						]
					},
				],
				genreProps: {
					children: 'children',
					label: 'label',
					desc: 'desc'
				},
				// Genre version 2
				structureData: [
					{ key: 0, label: 'Terms'},
					{ key: 1, label: 'Conceptual transitions' },
					{ key: 2, label: 'Line of argument' },
					{ key: 3, label: 'Central moves' }
				],
				structurePassed: [],
				deliveryData: [
					{ key: 0, label: 'Volume' },
					{ key: 1, label: 'Gestures' },
					{ key: 2, label: 'Metadiscourse' },
					{ key: 3, label: 'Posture' },
					{ key: 4, label: 'Language' },
				],
				deliveryPassed: [],
				styleData: [
					{ key: 0, label: 'Coherence' },
					{ key: 1, label: 'Concision' },
					{ key: 2, label: 'Flow' },
					{ key: 3, label: 'Emphasis' },
					{ key: 4, label: 'Figures of Speech' },
					{ key: 5, label: 'Figures of Sound' },
				],
				stylePassed: [],
				visualsData: [
					{ label: 'Pictorial cues' },
					{ label: 'Slide titles' },
					{ label: 'Image-text highlight' },
					{ label: 'Graphics' },
					{ label: 'Memorable images' }
				],
				visualsPassed: []
			}
		},
		methods: {
			handleNodeClick(data) {
				console.log(data);
			},
		},
		created() {	
			this.$store.dispatch('getAllVideos')
			this.$store.dispatch('getAllClasses')
			this.$store.state.currentClassSelected = 'Home'
		},
		mounted() {
			// Check if role is professor. If not redirect to current role's homePage
			const role = this.$root.$options.authService.getAuthData().role
			// console.log("professor.vue, role: " + role)
			if (role.toLowerCase() != "professor") {
				// console.log("professor.vue, pushing router /decideHome")
				this.$router.push('/DecideHome')
			}
			document.body.style.backgroundImage = "none"
			document.body.style.backgroundColor = "#FFF"
		},
		computed: {
			...mapGetters(
				['videos', 'classes', 'currentClassSelected', 'currentClassNumber']
			)
		},
		components: {
			'upload-video': UploadVideo,
			'my-header': MyHeader,
			'my-footer': MyFooter,
			'mt-video-card': MtVideoCard,
			'mt-video-itemlist': MtVideoItemList,
			'mt-sidebar': MtSidebar
		}
	}
</script>

	<style>
	/* ==============================================
									#GENERAL-LAYOUT
		================================================= */

	.professor__body { 
		margin-bottom: 0 !important;
		min-height: calc(100vh - 160px);
	}

	.professor__main {
		padding-left: 30px;
		margin-top: 25px;
	}





	/* ==============================================
									#FEATURED
		================================================= */

		.professor__featured {

		}

			.professor__featured-container {
				display:flex;
				flex-wrap: wrap;
			}
				
			.featured__heading {
				background-color: #16324f;
				color: #FFF;
				padding: 9px;
				margin-bottom: 0.5em !important;
				border-radius: 7px;
			}





/* ==============================================
                #FTDCARD (Featured card)
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





	/* ==============================================
									#CLASS-VIDEOS
		================================================= */

			.professor__classvideos {
				margin-top: 10px;
			}

			.class__heading {
				background-color: #16324f;
				color: #FFF;
				padding: 9px;
				margin-bottom: 0.5em !important;
				border-radius: 7px;
			}

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

				.classvideo__metadata {
					display: flex;
					justify-content: space-between;
					margin-left: 20px;
					width: 100%;
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
						}
								.classvideo__scoreNum {
									font-weight: 600;
									font-size: 1.8em;
									height: 50%;
									margin-top: 10px;
								}
								.classvideo__scoreLabel {
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

	/* ==============================================
									#ANNOTATION-BADGE
		================================================= */

			.el-badge {
					position: relative;
					vertical-align: middle;
					display: inline-block;
			top: -120px;
			}

			.el-badge__content {
					background-color: #A90931;
					border-radius: 10px;
					color: #fff;
					display: inline-block;
					font-size: 12px;
					height: 18px;
					line-height: 18px;
					padding: 0 6px;
					text-align: center;
					border: 1px solid #fff;
			}





	/* ==============================================
									#TRUMPS-BULMA-THEME
		================================================= */
	.nav.is-dark {
		background-color: #232B2D;
		color: #F6F7F7;
	}
	.nav.is-dark .nav-item a, .nav.is-dark a.nav-item {
			color: #F6F7F7;
	}
	.nav.is-dark .nav-item a.button.is-default {
			color: #F6F7F7;
			background-color: transparent;
			border-width: 2px;
	}
	.nav.menu {
		border-bottom: 1px solid #e1e1e1;
	}
	.nav.menu .nav-item .icon-btn {
		border: 3px solid #B7C6C9;
		border-radius: 90px;
		padding: 5px 7px;
		color: #B7C6C9;
	}
	.nav.menu .nav-item.is-active .icon-btn {
		color: #2EB398;
		border: 3px solid #2EB398;
	}
	.nav.menu .nav-item .icon-btn .fa {
		font-size: 20px;
		color: #B7C6C9;
	}
	.nav.menu .nav-item.is-active .icon-btn .fa {
		color: #2EB398;
	}
	.aside {
		display:block;
		background-color: #F9F9F9;
		border-right: 1px solid #DEDEDE;
	}
	.messages {
		display:block;
		background-color: #fff;
		border-right: 1px solid #DEDEDE;
	}
	.message {
		display:block;
		background-color: #fff;
	}
	.aside .compose {
		height: 95px;
		margin:0 -10px;
		padding: 25px 30px;
	}
	.aside .compose .button {
		color: #F6F7F7;
	}
	.aside .compose .button .compose {
		font-size: 14px;
		font-weight: 700;
	}
	.aside .main {
		padding: 40px;
		color: #6F7B7E;
	}
	.aside .title {
		color: #6F7B7E;
		font-size: 12px;
		font-weight: bold;
		text-transform: uppercase;
	}
	.aside .main .item {
		display: block;
		padding: 10px 0;
		color: #6F7B7E;
	}
	.aside .main .item.active {
		background-color: #F1F1F1;
		margin: 0 -50px;
		padding-left: 50px;
	}
	.aside .main .item:active,.aside .main .item:hover {
		background-color: #F2F2F2;
		margin: 0 -50px;
		padding-left: 50px;
	}
	.aside .main .icon {
		font-size: 19px;
		padding-right: 30px;
		color: #A0A0A0;
	}
	.aside .main .name {
		font-size: 15px;
		color: #5D5D5D;
		font-weight: 500;
	}
	.messages {
		padding: 40px 20px;
	}
	.message {
		padding: 40px 20px;
	}
	.messages .action-buttons {
		padding: 0;
		margin-top: -20px;
	}
	.message .action-buttons {
		padding: 0;
		margin-top: -5px;
	}
	.action-buttons .control.is-grouped {
		display: inline-block;
		margin-right: 30px;
	}
	.action-buttons .control.is-grouped:last-child {
		margin-right: 0;
	}
	.action-buttons .control.is-grouped .button:first-child {
		border-radius: 5px 0 0 5px;
	}
	.action-buttons .control.is-grouped .button:last-child {
		border-radius: 0 5px 5px 0;
	}
	.action-buttons .control.is-grouped .button {
		margin-right: -5px;
		border-radius: 0;
	}
	.pg {
		display: inline-block;
		top:10px;
	}
	.action-buttons .pg .title {
		display: block;
		margin-top: 0;
		padding-top: 0;
		margin-bottom: 3px;
		font-size:12px;
		color: #AAAAAA;
	}
	.action-buttons .pg a{
		font-size:12px;
		color: #AAAAAA;
		text-decoration: none;
	}
	.is-grouped .button {
		background-image: linear-gradient(#F8F8F8, #F1F1F1);
	}
	.is-grouped .button .fa {
		font-size: 15px;
		color: #AAAAAA;
	}
	.inbox-messages {
		margin-top:60px;
	}
	.message-preview {
		margin-top: 60px;
	}
	.inbox-messages .card {
		width: 100%;
	}
	.inbox-messages strong {
		color: #5D5D5D;
	}
	.inbox-messages .msg-check {
		padding: 0 20px;
	}
	.inbox-messages .msg-subject {
		padding: 10px 0;
		color: #5D5D5D;
	}
	.inbox-messages .msg-attachment {
		float:right;
	}
	.inbox-messages .msg-snippet {
		padding: 5px 20px 0px 5px;
	}
	.inbox-messages .msg-subject .fa {
		font-size: 14px;
		padding:3px 0;
	}
	.inbox-messages .msg-timestamp {
		float: right;
		padding: 0 20px;
		color: #5D5D5D;
	}
	.message-preview .avatar {
		display: inline-block;
	}
	.message-preview .top .address {
		display: inline-block;
		padding: 0 20px;
	}
	.avatar img {
		width: 40px;
		border-radius: 50px;
		border: 2px solid #999;
		padding: 2px;
	}
	.address .name {
		font-size: 16px;
		font-weight: bold;
	}
	.address .email {
		font-weight: bold;
		color: #B6C7D1;
	}
	.card.active {
		background-color:#F5F5F5;
	}
				
				

		



		/* ==============================================
									#TRUMPS
		================================================= */
		
		.dialog-footer .el-button.upload-video-btn {
			background: #A90931;
			color: #fff;
			border: none;
		}

		.inputfile {
			width: 0.1px;
			height: 0.1px;
			opacity: 0;
			overflow: hidden;
			position: absolute;
			z-index: -1;
		}
		.inputfile + label {
			font-size: 1.25em;
			font-weight: 700;
			color: white;
			background-color: black;
			display: inline-block;
		}

		.inputfile:focus + label,
		.inputfile + label:hover {
			background-color: red;
		}
		.inputfile + label {
			cursor: pointer; /* "hand" cursor */
		}
		.inputfile:focus + label {
			outline: 1px dotted #000;
			outline: -webkit-focus-ring-color auto 5px;
		}

		.up-label {
			padding: 100px 135px 100px 135px;
				font-size: 1.7em;
		}




		/* ==============================================
									#HELPERS
		================================================= */

		.is-bg-light {
			background-color: #f1f1f1;
		}
		.is-bg-mt-yellow {
			background-color: #B6AC1C;
		}
					.menu-list .is-bg-mt-yellow:hover {
							background-color: #ada316;
					}

	</style>